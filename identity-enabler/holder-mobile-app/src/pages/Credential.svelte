<script>
    import { navigate } from "svelte-routing";
    
    import Button from '../components/Button.svelte';
    import ObjectList from '../components/ObjectList.svelte';

    import { modalStatus, storedCredentials } from '../lib/store';

    import { ServiceFactory } from '../factories/serviceFactory';
	import { IdentityService } from '../services/identityService';

    // const idFromUrl = window.history.state.id;

    const credential = window.history.state.credential;
    // $storedCredentials.find((credential) => credential.id === idFromUrl);

    console.log('credential page', credential);

	const identityService = ServiceFactory.get('identity');

    const preparedCredentialDocument = identityService.prepareCredentialForDisplay(credential.credentialDocument);

    function share() {
        modalStatus.set({ active: true, type: 'accept', props: { credential } });
        navigate('createPresentation', { state: { credential }});
    }

    function goBack() {
        navigate('home');
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
        padding-top: 2vh;
        min-height: 36vh;
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
        font-family: 'Inter', sans-serif;
        font-weight: 1000;
        font-size: 3vw;
        line-height: 4vw;
        color: #fff;
    }
    header > p:nth-child(1) {
        text-transform: uppercase;
    }

    header > p:nth-child(2) {
        font-family: 'Metropolis', sans-serif;
        font-style: normal;
        font-weight: bold;
        font-size: 6vw;
        line-height: 7vw;
    }

    section {
        margin: 0 7vw;
    }

    footer {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 28vh;
        padding: 0 20vw;
        margin-left: auto;
        margin-right: auto;
        max-width: var(--max-width);
    }

    @media (max-width: 139vw) {
        footer {
            bottom: 5vh;
        }
    }

    .chevron {
        z-index: 1;
        position: fixed;
        left: 7vw;
        top: 7vh;
    }

    .credential-logo {
        width: 15%;
    }

    .share-wrapper {
        position: fixed;
        bottom: 0;
        height: 0;
    }
</style>

<main>
    <div style="background-color: {credential.enrichment.theme}" class="wrapper">
        <img class="chevron" on:click="{goBack}" src="../assets/chevron-left.svg" alt="" />
        <div class="header">
            <img class="credential-logo" src="../assets/credentialLarge.svg" alt="" />
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
            <Button label="Share" onClick="{share}"><img src="../assets/share.png" alt="" /></Button>
        </footer>
    </div>
    <div class="share-wrapper">
        Share me
    </div>
</main>
