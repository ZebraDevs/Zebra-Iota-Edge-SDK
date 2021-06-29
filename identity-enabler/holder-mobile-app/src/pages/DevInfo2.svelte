<script>
	import { navigate } from "svelte-routing";

	function goBack() {
        navigate('home');
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
        position: fixed;
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
        <span>DECENTRALIZED IDENTIFIERS</span>
		<img class="close" on:click="{goBack}" src="../assets/close.svg" alt="close" />
	</div>
	<section>
		<p>
			Decentralized Identifiers (DID) is the fundamental standard that supports the concept of a decentralized digital identity. 
            A DID is a unique identifier that contains enough information to be resolved to a DID Document. 
            This document contains data such as public keys, enabling the holder to prove ownership over their personal data, 
            but also URI's that link to public information about the identity. 
            This implementation complies to the DID specifications v1.0 Working Draft 20200731. 
		</p>
		<p>
			In the IOTA Identity framework, we have implemented the DID standard according to the iota DID Method Specification, which can be viewed here.
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
