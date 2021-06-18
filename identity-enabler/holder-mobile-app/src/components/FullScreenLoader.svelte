<script>
  import Spinner from './Spinner.svelte';

  export let label;
</script>

<style>
  .loader-wrapper {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    row-gap: 40px;
    background: linear-gradient(90deg, #00FFFF 0%, #0099FF 100%);
  }
  .loader-label {
    /* font-family: Proxima Nova; */
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 16px;
    text-align: center;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #F8F8F8;
    margin-top: 40px;
  }
</style>

<div class="loader-wrapper">
    <Spinner />
    <div class="loader-label">{label}</div>
</div>
