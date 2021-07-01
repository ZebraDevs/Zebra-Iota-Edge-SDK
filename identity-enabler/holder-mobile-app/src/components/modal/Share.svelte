<script>
    import { getContext } from 'svelte';
    import { navigate } from "svelte-routing";

    import { modalStatus } from '../../lib/store';
    import Button from '../Button.svelte';

    import { ServiceFactory } from '../../factories/serviceFactory';
	import { IdentityService } from '../../services/identityService';

    const { close } = getContext('simple-modal');

    const credential = window.history.state.credential;
	const identityService = ServiceFactory.get('identity');
    const preparedCredentialDocument = identityService.prepareCredentialForDisplay(credential.credentialDocument);

    function share() {
        navigate('createPresentation', { state: { credential }});
        close();
    }
</script>

<style>
    .btn-wrapper {
        font-family: 'Proxima Nova', sans-serif;
        font-weight: 600 !important;
        font-size: 6.3vh !important;
        line-height: 3.4vh !important;
        margin: 9.3vh 5.3vh 5.3vh 5.3vh;
    }

    .border {
       margin: 2.9vh 0;
       border: 1px solid #DFDFDF;
    }

    .modal-icon {
        width: 16px;
        height: 16px;
        margin-right: 2.3vh;
    }
</style>

<section>
    <div class="modal-wrapper">
        <div class="btn-wrapper">
            <Button style="background: white; color: #051923; display: flex; justify-content: flex-start;
                            padding: 0;
                            height: fit-content;
                            font-weight: 600;
                            font-size: 2.3vh;
                            line-height: 3.4vh;" 
                    label="Share as data matrix"
                    onClick="{share}"
            >
                <img class="modal-icon" src="../assets/data-matrix.svg" alt="data-matrix" />
            </Button>
            <div class="border"></div>
            <Button style="background: white; color: #051923; display: flex; justify-content: flex-start;
                            padding: 0;
                            height: fit-content;
                            font-weight: 600;
                            font-size: 2.3vh;
                            line-height: 3.4vh;" 
                    label="Share as a link"
                    onClick="{share}"
            >
                <img class="modal-icon" src="../assets/link.svg" alt="link" />
            </Button>
        </div>
    </div>
</section>
