const udp = require('dgram')
import type { Logger } from 'homebridge';

/**
 * Try to find a Spa on the network automatically, using UDP broadcast
 * @param log 
 * @param foundSpaCallback call with the ip address of any Spa found on the network
 */
export function discoverSpas(log: Logger, foundSpaCallback: (ip: string) => void) {
    // creating a client socket
    const client = udp.createSocket({ type: 'udp4', reuseAddr: true, broadcast: true });

    let host = '255.255.255.255';
    // Balboa Wifi module listens on this port.
    let port = 30303;
    let timeout = 10000;

    client.on('message', (msg: any, info: any) => {
        log.debug('UDP Data received from server : ' + msg.toString());
        log.debug('UDP Received %d bytes from %s:%d', msg.length, info.address, info.port);
        if (msg.length >= 6 && msg.slice(0,6) == 'BWGSPA') {
            log.info('Discovered a Spa at', info.address);
            foundSpaCallback(info.address);
        }
    });

    //buffer msg - doesn't really matter what we send
    const data = Buffer.from('Discovery: Who is out there?');

    // I don't claim to fully understand this line, and its need in relation to the
    // attempt above to set 'broadcast = true' on socket construction. But this line is
    // essential to this function working.
    client.bind(() =>{
        client.setBroadcast(true);
    });

    //sending msg
    client.send(data, port, host, (error : any) => {
        if (error) {
            log.warn(error);
            client.close();
        } else {
            log.debug('UDP discovery broadcast message sent');
        }
    });
    
    setTimeout(() => {
        client.close()
    }, timeout);


}

