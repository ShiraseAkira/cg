export async function initSound() {
    let promise = new Promise(resolve => {
        const audio = new Audio();
        audio.loop = true;
        audio.addEventListener("canplay", () => {
            const startPlayIfPossible = () => {
                const promise = audio.play();
                promise.catch((e) => {
                    console.log(e);
                    setTimeout(startPlayIfPossible, 1000);
                })
            }
            setTimeout(startPlayIfPossible, 1000);
            resolve(audio);
        });
        audio.src = "./sounds/SR Fly Theme.mp3";
    });
    const bgmSound = await promise;

    promise = new Promise(resolve => {
        const audio = new Audio();
        audio.addEventListener("canplay", () => {
            resolve(audio);
        });
        audio.src = "./sounds/explosion.wav";
    });
    const explosionSound = await promise;


    let explosionSoundPlayed = false;
    function playExplosionSoundIfNeeded(data)  {
        if(!data.isCollapsed && explosionSoundPlayed) {
            explosionSoundPlayed = false;
            explosionSound.pause();
            explosionSound.currentTime = 0;
            bgmSound.play();
        }

        if(data.isCollapsed && !explosionSoundPlayed) {
            bgmSound.pause();
            explosionSound.play();
            explosionSoundPlayed = true;
        }
    }

    return { playExplosionSoundIfNeeded };
}