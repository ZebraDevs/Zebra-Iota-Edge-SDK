<script>
    import { beforeUpdate } from 'svelte';
    import { fly } from 'svelte/transition';
    import { Plugins } from '@capacitor/core';
    import { updateStorage } from '../lib/store';
    import Button from '../components/Button.svelte';
    import ObjectList from '../components/ObjectList.svelte';
    import DevInfo from './DevInfo.svelte';
    import { isExpired } from '../lib/helpers';
    import { navigate } from 'svelte-routing';

    const { App, Modals } = Plugins;

    let showTutorial = false;
    let credential = window.history.state.credential;
    let expired = isExpired(credential.issuanceDate);

    async function onDelete() {
		let confirmRet = await Modals.confirm({
			title: 'Delete credential',
			message: 'Are you sure you want to delete the credential?'
		});
		if (confirmRet.value) {
			await updateStorage('credentials', { [credential.type[1].split(/\b/)[0].toLowerCase()]: '' });
            navigate("/home");
		}
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

    .header-wrapper {
        text-align: center;
        padding-bottom: 3vh;
        background: linear-gradient(90deg, #00FFFF 0%, #0099FF 100%);
    }

    header {
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
        z-index: 0;
    }

    footer {
        position: fixed;
        width: 100%;
        bottom: 0;
        z-index: 1;
    }

    .credential-logo {
        width: 15%;
    }

    .options-wrapper {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin: 3.5vh 3.5vh 0 3.5vh;
        z-index: 2;
    }
</style>

<main transition:fly="{{ x: 500, duration: 500 }}">
    {#if showTutorial}
		<DevInfo page="Credential" bind:showTutorial={showTutorial} />
	{/if}

    {#if !showTutorial}
        <div class="header-wrapper" style={expired ? 'background: #000000;' : null}>
            <div class="options-wrapper">
                <img src="../assets/delete.svg" on:click="{onDelete}" alt="delete" />
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
        </div>
        <section>
            <ObjectList object="{credential.credentialSubject}" />
        </section>
        <footer>
            <Button style="background: #0099FF; color: white;" label="Done" onClick="{() => navigate("/home")}" />
        </footer>
    {/if}
</main>
