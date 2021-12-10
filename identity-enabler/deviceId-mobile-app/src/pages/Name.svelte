<script>
    import { Plugins } from '@capacitor/core';
    import { navigate } from "svelte-routing";

    import Button from '../components/Button.svelte';
    import TextField from '../components/TextField.svelte';
    import Header from '../components/Header.svelte';
	import FullScreenLoader from '../components/FullScreenLoader.svelte';

    import { ServiceFactory } from '../factories/serviceFactory';
	import { account, error, hasSetupAccount } from '../lib/store';
    import { showAlert } from '../lib/ui/helpers';
    
    const { Keyboard } = Plugins;

    let name = '';
    let isKeyboardActive = false;
	let loading = false;

    let background;
    let keyboardHeight;

    Keyboard.addListener('keyboardWillShow', (info) => {
        keyboardHeight = info.keyboardHeight;
        isKeyboardActive = true;
    });

    Keyboard.addListener('keyboardWillHide', () => {
        isKeyboardActive = false;
    });

    function handleOuterClick() {
        if (event.target === background) {
            event.preventDefault();

            if (document.activeElement) {
                document.activeElement.blur();
            }
        }
    }

    async function save() {
        if (navigator.onLine === false) {
            showAlert('Error', 'You need Internet connectivity to generate a new IOTA Device Identity');
            return;
        } 

        if (loading) {
            return;
        }

        Keyboard.hide();

        error.set(null);

        account.set({ name: name });

        loading = true;

        try {
            const identityService = ServiceFactory.get('identity');
            const identity = await identityService.createIdentity();
            await identityService.storeIdentity('did', identity);
            console.log('Identity', identity)
            loading = false;
            hasSetupAccount.set(true);

            navigate('home');
        } catch (err) {
            error.set('Error creating identity. Please try again.');
            loading = false;
        }
    }
</script>

<style>
    main {
        height: 100%;
        background-color: #F8F8F8;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        position: absolute;
        width: 100%;
    }

    .headerContainer {
        display: flex;
        flex: 0.5;
    }

    .contentContainer {
        display: flex;
    }

    .contentContainer {
        text-align: center;
        align-items: center;
        display: flex;
        flex-direction: column;
        flex: 1;
        width: 100%;
        padding: 0 3.4vh;
    }

    .contentContainer > img {
        mix-blend-mode: multiply;
        width: 25.8vh;
        height: 25.8vh;
        margin-top: contentMargin;
    }

    .active {
        margin-top: 7.6vh;
    }

    footer {
        padding: 0px 7vw;
        width: 100vh;
        position: absolute;
        bottom: 0;
    }
</style>

<main
    bind:this="{background}"
    on:click="{handleOuterClick}"
>
    {#if loading}
        <FullScreenLoader label="Creating Identity..." />
    {:else}
        <div class="headerContainer">
            <Header text="Set the name of
                            the device" />
        </div>

        <div class="contentContainer">
            <img class="{isKeyboardActive ? "active" : "inactive"}" src="../assets/landing-2.png" alt="set-name" />
            <TextField bind:value="{name}" placeholder="Device name" />
        </div>

        <footer>
            <Button
                style="background: #00A7FF; color: white; height: 64px;" 
                loadingText="{'Generating identity'}"
                disabled="{name.length === 0}"
                label="Next"
                onClick="{save}"
            />
        </footer>
    {/if}
</main>
