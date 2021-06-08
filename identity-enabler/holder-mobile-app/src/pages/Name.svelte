<script>
    import { Plugins } from '@capacitor/core';
    import { onDestroy } from 'svelte';
    import { flip } from 'svelte/animate';

    import Button from '../components/Button.svelte';
    import TextField from '../components/TextField.svelte';
    import Header from '../components/Header.svelte';

    const { Keyboard } = Plugins;

    let firstName = '';
    let isKeyboardActive = false;
    let isCreatingCredentials = false;

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

    function save() {
        // if (isCreatingCredentials) {
        //     return;
        // }
        // isCreatingCredentials = true;

        Keyboard.hide();

        setTimeout(() => {
            console.log('Identity')
        }, 500);
    }
</script>

<style>
    main {
        height: 100%;
        background-color: #F8F8F8;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        position: absolute;
        padding: 6vh 5vw;
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
    }

    img {
        width: 27vh;
        height: 27vh;
    }

    .info {
        font-family: 'Inter', sans-serif;
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
    <main
        bind:this="{background}"
        on:click="{handleOuterClick}"
        style="top: {isKeyboardActive ? `-${keyboardHeight}px` : '0'}"
        animate:flip="{{ duration: 350 }}"
    >
        <Header text="Set your first name" />

        <div class="content"><img src="../assets/set-name.png" alt="" /></div>

        <p class="info">Selv will generate you an identity using randomised personal information.</p>

        <TextField disabled="{isCreatingCredentials}" bind:value="{firstName}" placeholder="First name" />

        <footer>
            <Button
                loading="{isCreatingCredentials}"
                loadingText="{'Generating identity'}"
                disabled="{firstName.length === 0}"
                label="Save Name"
                onClick="{save}"
            />
        </footer>
    </main>
{/each}
