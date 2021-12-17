init()
.then(() => console.log('Initialized'))
.catch(e => {
    console.error(e);
    alert(`Error during initialization: ${e.message}`);
});


async function init() {
  const videoEl = document.getElementById("video");

  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error("Browser camera access not supported.");
  }

  videoEl.srcObject = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: { ideal: "environment" }
    },
  });
}
