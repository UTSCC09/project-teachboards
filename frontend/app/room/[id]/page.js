'use client'

import Call from '../../Components/Call/Call';

let options = {
    // Pass your app ID here.
    appId: "5b04cf1dad0645189bd6533cef7c2158",
    // Set the channel name.
    channel: "main",
    // Use a temp token
    token: "007eJxTYDCMe/yNa7sc+6UNxy5KPzG88qe5Jt9qQnPsO6vXAZEfzmUoMJgmGZgkpxmmJKYYmJmYGlpYJqWYmRobJ6emmScbGZpaSM53S28IZGTYta6cmZEBAkF8FobcxMw8BgYAzsAg+A==",
    uid: Math.round(Math.random()*100),
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
