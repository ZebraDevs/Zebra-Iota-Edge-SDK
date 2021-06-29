<script>
    import { Plugins } from '@capacitor/core';
    import { onDestroy, onMount } from 'svelte';
    import { flip } from 'svelte/animate';
    import { navigate } from "svelte-routing";

    import Button from '../components/Button.svelte';
    import TextField from '../components/TextField.svelte';
    import Header from '../components/Header.svelte';
	import FullScreenLoader from '../components/FullScreenLoader.svelte';

    import { ServiceFactory } from '../factories/serviceFactory';
	import { IdentityService } from '../services/identityService';
	import { account, error, hasSetupAccount } from '../lib/store';
    
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
    .name-container {
        height: 100%;
        background-color: #F8F8F8;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        position: absolute;
        width: 100%;
    }

    .content {
        text-align: center;
        z-index: 1;
    }

    .content > img {
        mix-blend-mode: multiply;
    }

    footer {
        padding: 0px 7vw;
        width: 100vh;
    }

    img {
        width: 27vh;
        height: 27vh;
        margin-top: 12.5vh;
    }

    .info {
        font-family: 'Proxima Nova', sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 2.08vh;
        line-height: 3.3vh;
        color: #6f7a8d;
        text-align: center;
        padding: 0px 3vw;
        width: 100%;
    }
</style>

{#each [true] as item, index (item)}
    <div
        class="name-container"
        bind:this="{background}"
        on:click="{handleOuterClick}"
        style="top: {isKeyboardActive ? `-${keyboardHeight}px` : '0'}"
        animate:flip="{{ duration: 350 }}"
    >
        {#if loading}
            <FullScreenLoader label="Creating Identity..." />
        {:else}
            <Header text="Set your name" />

            <div class="content"><img src="../assets/set-name.png" alt="" /></div>

            <TextField bind:value="{name}" placeholder="Your Name" />

            <footer>
                <Button
                    style="background: #00A7FF; color: white;" 
                    loadingText="{'Generating identity'}"
                    disabled="{name.length === 0}"
                    label="Next"
                    onClick="{save}"
                />
            </footer>
        {/if}
    </div>
{/each}
