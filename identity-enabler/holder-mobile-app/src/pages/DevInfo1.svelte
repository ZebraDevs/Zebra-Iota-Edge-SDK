<script>
	import { navigate } from "svelte-routing";

	import { ServiceFactory } from '../factories/serviceFactory';
	import { IdentityService } from '../services/identityService';

    const credential = window.history.state.credential;
	const identityService = ServiceFactory.get('identity');
    const preparedCredentialDocument = identityService.prepareCredentialForDisplay(credential.credentialDocument);

	function goBack() {
        navigate('createPresentation', { state: { credential: credential }});
    }
</script>

<style>
	main {
        height: 100%;
        background: white;
		display: flex;
		flex-direction: column;
    }

    .header-wrapper {
        text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
		background: black;
		padding: 4vh 17.7vh;
		position: relative;
    }

	.header-wrapper > span {
        font-family: 'Proxima Nova', sans-serif;
        font-weight: 500;
        font-size: 2vh;
        line-height: 2.3vh;
        color: #fff;
		white-space: nowrap;
    }

	.close {
		position: absolute;
		right: 3.4vh;
    }

	section {
		margin: 0 2.3vh;
	}

	section > p {
		font-size: 2vh;
	}

	.box-wrapper {
		background: #EEEEEE;
		border-radius: 4px;
		padding: 2.15vh 1.15vh;
		margin: 2.3vh 0;
		font-size: 2vh;
        line-height: 2.3vh;
	}

	.box-wrapper > span, code {
		overflow-wrap: break-word;
  	    word-wrap: break-word;
  		hyphens: auto;
		font-size: 2vh;
        line-height: 2.3vh;
	}
</style>

<main>
	<div class="header-wrapper">
        <span>ADD NEW CREDENTIAL</span>
		<img class="close" on:click="{goBack}" src="../assets/close.svg" alt="close" />
	</div>
	<section>
		<div class="box-wrapper">
			<span style="font-weight: 600;">This app doesn’t support adding a new credential, but here’s how it works.</span>	
		</div>
		<p>
			In the IOTA Identity framework, we have implemented the DID standard according to the iota DID Method Specification, 
			which can be viewed here. 
			<br><br>
			An example of DID conforming to the iota method specification:
		</p>
		<div class="box-wrapper">
			<code>did:iota:8dQAzVbbf6FLW9ckwyCBnKmcMGcUV9LYJoXtgQkHcNQy</code>	
		</div>
		<p>Example of Publishing a DID Document to the Tangle:</p>
		<div class="box-wrapper">
			<code>
				use identity::iota::Client;
				<br>
				use identity::iota::IotaDocument;
				<br><br>
				//Setting up the IOTA Network
				<br>
				let client: Client = Client::new()?;
				<br><br>
				let network: &str = client.network().as_str(); 
				<br><br>
				//Generating a DID Document 
				<br>
				let (mut document, keypair): (IotaDocument, KeyPair) = IotaDocument::builder().did_network(network).build()?;
				<br><br>
				//Signing and publish to the Tangle
				<br>
				document.sign(keypair.secret())?; document.publish_with_client(&client).await?;
			</code>
		</div>
	</section>
</main>
