<script>
    import { navigate } from "svelte-routing";
    
    import Button from '../components/Button.svelte';
    import ObjectList from '../components/ObjectList.svelte';

    import { modalStatus, storedCredentials } from '../lib/store';

    import { ServiceFactory } from '../factories/serviceFactory';
	import { IdentityService } from '../services/identityService';

    const credential = window.history.state.credential;
	const identityService = ServiceFactory.get('identity');
    const preparedCredentialDocument = identityService.prepareCredentialForDisplay(credential.credentialDocument);

    function share() {
        modalStatus.set({ active: true, type: 'share', props: { credential } });
    }

    function goBack() {
        navigate('home');
    }

    function onClickDev() {
        navigate('devinfo2');
    }
</script>

<style>
    main {
        display: flex;
        flex-direction: column;
        min-height: 100%;
        background-color: var(--bg);
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        position: relative;
    }

    header {
        margin-bottom: 5vh;
    }

    .wrapper {
        text-align: center;
        padding-bottom: 16vh;
        min-height: 36vh;
        background: linear-gradient(90deg, #00FFFF 0%, #0099FF 100%);
    }

    .header {
        position: absolute;
        top: 2vh;
        left: 0;
        right: 0;
        margin-left: auto;
        margin-right: auto;
    }

    header > p {
        margin-top: 2vh;
        font-family: 'Proxima Nova', sans-serif;
        font-weight: 600;
        font-size: 3vw;
        line-height: 4vw;
        color: #fff;
    }
    header > p:nth-child(1) {
        text-transform: uppercase;
    }

    header > p:nth-child(2) {
        font-family: 'Proxima Nova', sans-serif;
        font-style: normal;
        font-weight: bold;
        font-size: 6vw;
        line-height: 7vw;
    }

    section {
        margin: 0 7vw 17vw 7vw;
    }

    footer {
        position: fixed;
        width: 100%;
        bottom: 0;
    }

    .credential-logo {
        width: 15%;
        margin-top: 6vh;
    }

    .options-wrapper {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin: 3.5vh 3.5vh 0 3.5vh;
        z-index: 2;
    }
</style>

<main>
    <div style="background-color: {credential.enrichment.theme}" class="wrapper">
        <div class="options-wrapper">
			<img src="../assets/chevron-left.svg" on:click="{goBack}" alt="chevron-left" />
            <img src="../assets/code.svg" on:click="{onClickDev}" alt="code" />
		</div>
        <div class="header">
            <img class="credential-logo" src="../assets/credentialLarge.svg" alt="credential-logo" />
            <header>
                <p>{credential.enrichment.issuerLabel}</p>
                <p>{credential.enrichment.credentialLabel}</p>
                <p>{new Date(preparedCredentialDocument.issuanceDate).toLocaleString()}</p>
            </header>

            <section>
                <ObjectList object="{preparedCredentialDocument.credentialSubject}" />
            </section>
        </div>

        <footer>
            <Button style="background: #0099FF; color: white;" label="Share" onClick="{share}">
                <img src="../assets/share.png" alt="share" />
            </Button>
        </footer>
    </div>
</main>
