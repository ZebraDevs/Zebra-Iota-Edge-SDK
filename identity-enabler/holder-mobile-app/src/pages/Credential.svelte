<script>
    import { navigate } from "svelte-routing";

    import Button from '../components/Button.svelte';
    import ObjectList from '../components/ObjectList.svelte';
    
    import { modalStatus } from '../lib/store';

    import { ServiceFactory } from '../factories/serviceFactory';

    const credential = window.history.state.credential;
	const identityService = ServiceFactory.get('identity');
    const preparedCredentialDocument = identityService.prepareCredentialForDisplay(credential.credentialDocument);

    function share() {
        modalStatus.set({ 
            active: true, 
            type: 'share', 
            props: { credential }
        });
    }

    function goBack() {
        navigate('home');
    }

    function onClickDev() {
        navigate('devinfo', { state: { page: 'Credential' }});
    }
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
        padding-bottom: 15vh;
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
        font-weight: 700;
        font-size: 3.4vh;
        line-height: 3.4vh;
        color: #fff;
    }

    header > p:nth-child(2) {
        font-weight: 600;
        text-transform: uppercase;
        font-size: 1.7vh;
        line-height: 2.3vh;
    }

    header > p:nth-child(3) {
        margin: 1.6vh 0 0 0;
    }

    header > p:nth-child(4) {
        margin-bottom: 0;
        font-size: 1.7vh;
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
    <div class="wrapper">
        <div class="options-wrapper">
			<img src="../assets/chevron-left.svg" on:click="{goBack}" alt="chevron-left" />
            <img src="../assets/code.svg" on:click="{onClickDev}" alt="code" />
		</div>
        <header>
            <img class="credential-logo" src="../assets/credentialLarge.svg" alt="credential-logo" />
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
</main>
