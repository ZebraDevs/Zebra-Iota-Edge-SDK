<script>
	import { navigate } from "svelte-routing";
	import { onMount } from 'svelte';
	import bwipjs from 'bwip-js';
	import { ServiceFactory } from '../factories/serviceFactory';
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
				console.log(storedIdentity, storedCredential);
				const verifiablePresentation = 
					await identityService.createVerifiablePresentation(storedIdentity, storedCredential.credentialDocument);
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
    navigate('credential', { state: { credential: credential }});
  }

	function onClickDev() {
    navigate('devinfo1');
  }

	function onClickPresentationJSON() {
    navigate('presentationjson', { state: { presentationJSON }});
	}
</script>

<style>
	main {
		display: flex;
		flex-direction: column;
		background-color: black;
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
		position: relative;
		height: 100%;
	}

	canvas {
		position: relative;
		width: 100%;
		z-index: 5;
	}

	.mini {
		width: 0px;
		height: 0px;
	}

	header > p {
		margin: 1.5vh 0 6.2vh 0;
		font-family: 'Proxima Nova', sans-serif;
		font-weight: 700;
		font-size: 5vw;
		line-height: 5vw;
		color: #fff;
		padding: 0;
	}

	header > span {
		font-family: 'Proxima Nova', sans-serif;
		font-weight: 600;
		font-size: 1.7vh;
		line-height: 2.3vh;
		color: #fff;
	}

	.wrapper {
        text-align: center;
	}

	.credential-logo {
        width: 15%;
		margin-bottom: 1.5vh;
	}

	.presentation-wrapper {
		height: fit-content;
		position: relative;
		background: white;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 100%;
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
		font-family: 'Proxima Nova', sans-serif;
		font-weight: 500;
		font-size: 2.9vh;
		line-height: 3.5vh;
	}

	.options-wrapper {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin: 3.5vh 3.5vh 0 3.5vh;
		position: relative;
		z-index: 2;
    }

	.footerContainer {
		position: fixed;
		text-align: center;
		width: 100%;
	}
</style>

<main>
	{#if loading}
		<FullScreenLoader label="Creating Data Matrix..." />
	{/if}
		<div class="{loading ? 'wrapper mini' : 'wrapper'}">
			{#if !loading}
				<div class="options-wrapper">
					<img src="../assets/chevron-left.svg" on:click="{goBack}" alt="chevron-left" />
					<img src="../assets/code.svg" on:click="{onClickDev}" alt="code" />
				</div>
				<div class="header">
					<img class="credential-logo" src="../assets/credentialLarge.svg" alt="credential-logo" />
					<header>
							<span>{credential.enrichment.issuerLabel.toUpperCase()}</span>
							<p>{credential.enrichment.credentialLabel}</p>
					</header>
				</div>
			{/if}
			<div class="presentation-wrapper">
				<canvas id="presentation"></canvas>
			</div>

			{#if !loading}
				<footer class="footerContainer">
					<p>Valid until {addDaysToDate(preparedCredentialDocument.issuanceDate, 30)}</p>
					<Button style="background: transparent; color: white; font-weight: 500; font-size: 1.7vh; line-height: 2.3vh; border: none; height:fit-content;" label="VIEW IN JSON FORMAT" onClick="{onClickPresentationJSON}" />
				</footer>
			{/if}
	</div>
</main>