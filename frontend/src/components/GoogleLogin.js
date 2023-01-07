import React, { useState, useEffect } from 'react';
import { gapi, loadAuth2 } from 'gapi-script'

function GoogleLogin() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function setAuth2() {
            const auth2 = await loadAuth2(gapi, process.env.REACT_APP_CLIENT_ID, '')
            if (auth2.isSignedIn.get()) {
                updateUser(auth2.currentUser.get())
            } else {
                attachSignin(document.getElementById('customBtn'), auth2);
            }
        }
        setAuth2();
    }, []);

    useEffect(() => {
        if (!user) {
            const setAuth2 = async () => {
                const auth2 = await loadAuth2(gapi, process.env.REACT_APP_CLIENT_ID, '')
                attachSignin(document.getElementById('customBtn'), auth2);
            }
            setAuth2();
        }
    }, [user])

    function updateUser(currentUser) {
        const v = currentUser
        console.log(v)
        const name = currentUser.getBasicProfile().getName();
        const profileImg = currentUser.getBasicProfile().getImageUrl();
        setUser({
            name: name,
            profileImg: profileImg,
        });
    }

    function attachSignin(element, auth2) {
        auth2.attachClickHandler(element, {},
            (googleUser) => {
                updateUser(googleUser);
            }, (error) => {
                console.log(JSON.stringify(error))
        });
    }

    function signOut() {
        const auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(() => {
            setUser(null);
            console.log('User signed out.');
        });
    }

    if(user) {
        return (
            <div>
                <div>{user.name}</div>
                <div id="" role="button" onClick={signOut}>
                    Logout from Google
                </div>
            </div>
        );
    }

    return (
        <div id="customBtn" role="button">
            Login with your Google Account
        </div>
    );
}

export default GoogleLogin;