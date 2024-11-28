'use client'

import Call from '../../Components/Call/Call';

let options = {
    // Pass your app ID here.
    appId: "5b04cf1dad0645189bd6533cef7c2158",
    // Set the channel name.
    channel: "main",
    // Use a temp token
    token: "007eJxTYJhuv/SsysN3X+ZNl/jfxLPoY9Q/R3PZ2e/Mkuw/XVT3LQ9SYDBNMjBJTjNMSUwxMDMxNbSwTEoxMzU2Tk5NM082MjS1+F7mkd4QyMjwt1KbgREKQXwWhtzEzDwGBgDVtiD2"
};

export default function GuestPage( {params} ) {
    const { id } = params;
    
    return (
        <div>
            <p>
                Room: {id}
            </p>
            <p>
                Channel: {options.channel}
            </p>
            <Call appId={options.appId} channelName={options.channel}></Call>
        </div>
    );
}
