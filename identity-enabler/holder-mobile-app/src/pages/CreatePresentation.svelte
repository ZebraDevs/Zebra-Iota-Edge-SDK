<script>
	import { Link } from "svelte-routing";
    import { onMount } from 'svelte';
	import bwipjs from 'bwip-js';
	import { ServiceFactory } from '../factories/serviceFactory';
	import { IdentityService } from '../services/identityService';
	import { error } from '../lib/store';
	import FullScreenLoader from '../components/FullScreenLoader.svelte';
	import Button from '../components/Button.svelte';

	let presentationJSON = '';
	let loading = true;

	const credential = window.history.state.credential;
	const identityService = ServiceFactory.get('identity');
    const preparedCredentialDocument = identityService.prepareCredentialForDisplay(credential.credentialDocument);

	async function createMatrix(content) {
		try {
			// The return value is the canvas element
			bwipjs.toCanvas('presentation', {
					bcid: 'datamatrix',
					text: content,
					scale: 3
			});
		} catch (e) {
				console.error(e)
		}
	}

	const addDaysToDate = (date, days) => {
	let dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    let res = new Date(date);
    res.setDate(res.getDate() + days);

    return res.toLocaleDateString('en-US', dateOptions);
}

	onMount(() => {
		setTimeout(async () => {
			const identityService = ServiceFactory.get('identity');

			error.set(null);

			try {
				const storedIdentity = await identityService.retrieveIdentity();
				// const storedCredential = await identityService.retrieveCredential('credentialId');

				const storedCredential = window.history.state.credential;
				console.log(storedIdentity, storedCredential)

				const verifiablePresentation = await identityService.createVerifiablePresentation(storedIdentity, storedCredential.credentialDocument);
				console.log('verifiablePresentation', verifiablePresentation)

				presentationJSON = JSON.stringify(verifiablePresentation, null, 2);

				await createMatrix(presentationJSON);

				loading = false;
			} catch (err) {
				error.set('Error creating identity. Please try again.');
				loading = false;
			}

		}, 500);
    });

	function goBack() {
        navigate('home');
    }

</script>

<style>
	main {
        height: 100%;
		width: 100%;
        background: black;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: space-between;
    }

	canvas {
		/* position: fixed; */
		width: 100%;
		height: 411px;
		z-index: 5;
	}

    .wrapper {
        text-align: center;
        background: white;
    }

	.header {
        position: absolute;
        top: 2vh;
        left: 0;
        right: 0;
		margin-top: 6vh;
		margin-bottom: 5vh;
    }

    header > p {
        margin-top: 1.5vh;
        font-family: 'Proxima Nova', sans-serif;
        font-weight: 700;
        font-size: 5vw;
        line-height: 5vw;
        color: #fff;
    }

	header > span {
        font-family: 'Proxima Nova', sans-serif;
        font-weight: 400;
        font-size: 4vw;
        line-height: 4vw;
        color: #fff;
    }

	.credential-logo {
		margin-bottom: 1.6vh;
	}

	.chevron {
        z-index: 1;
        position: fixed;
        left: 7vw;
        top: 7vh;
    }

	.presentation-wrapper {
		position: relative;
		top: 0.2vh;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}

	footer > p {
		color: #fff;
		padding: 4.6vh 0 1vh 0;
		margin: 0;
	}

	.footerContainer {
		position: fixed;
		width: 100%;
		background: black;
		bottom: 30;
	}
</style>

<main>
	{#if loading}
		<FullScreenLoader />
	{/if}

	<div class="wrapper">
        <img class="chevron" on:click="{goBack}" src="../assets/chevron-left.svg" alt="" />
        <div class="header">
            <img class="credential-logo" src="../assets/credentialLarge.svg" alt="" />
            <header>
                <span>{credential.enrichment.issuerLabel.toUpperCase()}</span>
                <p>{credential.enrichment.credentialLabel}</p>
            </header>
        </div>

	<div class="presentation-wrapper">
		<canvas id="presentation"></canvas>
	</div>

    <footer class="footerContainer">
		<p>Valid until {addDaysToDate(preparedCredentialDocument.issuanceDate, 30)}</p>
		<Button style="background: transparent; color: white; font-weight: 400; font-size: 1.3vh; border: none; height:fit-content;" label="VIEW IN JSON FORMAT" onClick="{''}" />
    </footer>
</main>
