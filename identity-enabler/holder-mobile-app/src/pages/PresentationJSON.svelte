<script>
	import Markdown from '../components/Markdown.svelte'

	const code = window.history.state.presentationJSON;

	function goBack() {
		history.back();
	}
</script>

<style>
	main {
			height: 100%;
			width: 100%;
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

	.highlightjs-component {
			overflow-wrap: break-word;
			word-wrap: break-word;
			overflow-x: auto;
			background: #EEEEEE;
			border-radius: 4px;
			padding: 0 1.15vh;
	}
</style>

<main>
	<div class="header-wrapper">
    <span>VERIFIABLE PRESENTATION</span>
		<img class="close" on:click="{goBack}" src="../assets/close.svg" alt="close" />
	</div>
	<section>
		<div class="highlightjs-component">
			<Markdown markdown={code} language="json" />
		</div>
	</section>
</main>
