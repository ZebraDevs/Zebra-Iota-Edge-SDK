<script>
	import { Plugins } from '@capacitor/core';
	import { onMount } from 'svelte';
	import { navigate } from "svelte-routing";
	import { slide } from 'svelte/transition';
	import { getFromStorage } from '../lib/store';
	import { isExpired } from '../lib/helpers';
	import FullScreenLoader from '../components/FullScreenLoader.svelte';
	import Button from '../components/Button.svelte';
	import ListItem from '../components/ListItem.svelte';
	import DevInfo from './DevInfo.svelte';
	import { showAlert } from '../lib/ui/helpers';

	const { App, Modals } = Plugins;

	let isEmpty = false;
	let showTutorial = false;
	let localCredentials = {};
	let loading = false;

	onMount(async () => {
		App.addListener("backButton", function(){}, false);
		setTimeout(async () => {
			try {
				loading = true;
				localCredentials = await getFromStorage('credentials');
				localCredentials = Object.values(localCredentials)?.filter(data => data);
				console.log('onMount', localCredentials);
				isEmpty = Object.values(localCredentials).every(x => x === null || x === '');
				loading = false;
			} catch (err) {
				console.log(err);
				loading = false;
			}
		}, 0);
    });

	function scan() {
		if (navigator.onLine === false) {
            showAlert('Error', 'You need Internet connectivity for verifying credentials');
            return;
        }
		// We ensure that only the Camera is switched on when we want
	    window['cameraStatus'] = 'on';
        navigate('/scan');
    }

	function onClickDev() {
		showTutorial = true;
	}

	function onClickCredential(credential) {
		navigate("/credential", { state: { credential } });
	}

	async function onClickReset() {
		let confirmRet = await Modals.confirm({
			title: 'Reset the app',
			message: 'Are you sure you want to reset the app and delete all credentials?'
		});
		if (confirmRet.value) {
			localStorage.setItem('credentials', JSON.stringify({
				personal: '',
				health: '',
				blood: ''
			}));
			localCredentials = {
				personal: '',
				health: '',
				blood: ''
			};
			isEmpty = Object.values(localCredentials).every(x => x === null || x === '');
		}
	}
</script>

<style>
	main {
			display: flex;
			flex-direction: column;
			height: 100%;
			width: 100%;
			z-index: 1;
	}

	header {
			display: flex;
			flex-direction: column;
			height: 72px;
			background: linear-gradient(90deg, #00FFFF 0%, #0099FF 100%);
	}

	section {
			flex: 1;
			align-content: space-between;
			overflow-y: auto;
			-webkit-overflow-scrolling: touch;
			background: #F8F8F8;
	}

	.list {
		padding: 0 20px;
	}

	.list:first-child {
			margin-top: 3.5vh;
	}

	.list:not(:last-child) {
			margin-bottom: 3vh;
	}

	.list:last-child {
			margin-bottom: 9vh;
	}
	
	.options-wrapper > p {
		font-family: 'Proxima Nova', sans-serif;
		font-weight: 600;
		font-size: 14px;
		line-height: 16px;
		color: #F8F8F8;
		margin: 0;
		z-index: 1;
	}

	.options-wrapper {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin: 3.5vh;
    }

	img {
		margin: 0 !important;
	}

	.code {
		margin-left: auto;
	}

	.empty-wrapper {
		height: 100%;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.empty-wrapper > p {
		font-family: 'Proxima Nova', sans-serif;
		font-size: 14px;
		color: #767676;
	}

	footer {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		bottom: 0;
		padding-bottom: 4.1vh;
		z-index: 1;
		background: #F8F8F8;
	}
</style>

<main>
	{#if loading}
		<FullScreenLoader label="loading Credentials..." />
	{/if}

	{#if showTutorial}
		<DevInfo page="Presentation" bind:showTutorial={showTutorial} />
	{/if}

	{#if !showTutorial && !loading}
		<header>
			<div class="options-wrapper">
				<img src="../assets/reset.svg" on:click="{onClickReset}" alt="reset" />
				<p>SCANNED CREDENTIALS</p>
				<img class="code" src="../assets/code.svg" on:click="{onClickDev}" alt="code" />
			</div>
		</header>
		<section>
			{#if isEmpty}
				<div class="empty-wrapper">
					<p>No credentials scanned</p>
				</div>
			{:else}
				{#each Object.values(localCredentials) as credential}
					<div transition:slide class="list">
						<ListItem
							onClick="{() => onClickCredential(credential)}"
							heading="{"IOTA"}"
							subheading="{credential.type[1]}"
							expired={isExpired(credential.issuanceDate)}
						/>
					</div>
				{/each}
			{/if}
		</section>
		<footer>
			<Button style="background: #00A7FF; color: white; height: 64px; width: 64px; border-radius: 50%;" onClick="{scan}">
				<img src="../assets/scan.png" alt="scan" />
			</Button>
		</footer>
	{/if}
</main>