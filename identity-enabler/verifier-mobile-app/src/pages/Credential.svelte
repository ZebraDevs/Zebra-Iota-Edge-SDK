<script>
    import { onMount } from 'svelte';
    import { navigate } from "svelte-routing";
    import { beforeUpdate } from 'svelte';
    import { Plugins } from '@capacitor/core';

    import { updateStorage } from '../lib/store';

    import Button from '../components/Button.svelte';
    import ObjectList from '../components/ObjectList.svelte';
    import DevInfo from './DevInfo.svelte';

    const { App, Modals } = Plugins;

    const credential = window.history.state.credential;

    let showTutorial = false;
    let expired = false ;

    onMount(() => {
        expired = isExpired();
    });

    function isExpired() {
        const expiryDate = addDaysToDate(credential.issuanceDate, 30);
        const today = new Date();
        if (today.getTime() > expiryDate.getTime()) {
            return true;
        } else {
            return false;
        }
    }

    function addDaysToDate(date, days) {
		let res = new Date(date);
        res.setDate(res.getDate() + days);
        return res;
	}

    async function onDelete() {
		let confirmRet = await Modals.confirm({
			title: 'Delete credential',
			message: 'Are you sure you want to delete the credential?'
		});
		if (confirmRet.value) {
			await updateStorage('credentials', { [credential.type[1].split(/\b/)[0].toLowerCase()]: '' });
			navigate('home');
		}
	}

    function goBack() {
        navigate('home');
    }

    function onClickDev() {
        showTutorial = true;
    }

	beforeUpdate(() => {
        !showTutorial && App.removeAllListeners();
	});
</script>

<style>
    main {
        display: flex;
		flex-direction: column;
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
		position: relative;
		height: 100%;
    }

    header {
        margin-bottom: 5vh;
    }

    .wrapper {
        text-align: center;
        padding-bottom: 5vh;
        max-height: 36vh;
        background: linear-gradient(90deg, #00FFFF 0%, #0099FF 100%);
    }

    header {
        position: absolute;
        left: 0;
        right: 0;
        margin-left: auto;
        margin-right: auto;
        z-index: 1;
        height: fit-content;
        margin-bottom: 0;
    }

    header > p {
        font-family: 'Proxima Nova', sans-serif;
        font-weight: 600;
        font-size: 1.9vh;
        line-height: 3.4vh;
        color: #fff;
        margin: 0;
    }

    section {
        margin: 0 7vw;
        z-index: 2;
    }

    footer {
        position: fixed;
        width: 100%;
        bottom: 0;
        z-index: 6;
    }

    .credential-logo {
        width: 15%;
    }

    .options-wrapper {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin: 3.5vh 3.5vh 0 3.5vh;
        z-index: 3;
    }
</style>

<main>
    {#if showTutorial}
		<DevInfo page="Credential" bind:showTutorial={showTutorial} />
	{/if}

    {#if !showTutorial}
    <div class="wrapper" style={expired ? 'background: #000000;' : null}>
        <div class="options-wrapper">
			<img src="../assets/trash.svg" on:click="{onDelete}" alt="chevron-left" />
            <img src="../assets/code.svg" on:click="{onClickDev}" alt="code" />
		</div>
        <header>
            {#if !expired}
            <img class="credential-logo" src="../assets/tick-large.svg" alt="valid" />
                <p>VALID CREDENTIAL</p>
            {:else}
                <img class="credential-logo" src="../assets/expire.svg" alt="expired" />
                <p>EXPIRED CREDENTIAL</p>
            {/if}
        </header>
        <section>
            <ObjectList object="{credential.credentialSubject}" />
        </section>
    </div>
    <footer>
        <Button style="background: #0099FF; color: white;" label="Done" onClick="{goBack}" />
    </footer>
    {/if}
</main>
