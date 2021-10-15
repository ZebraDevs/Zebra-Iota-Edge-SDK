<script>
    import Button from '../components/Button.svelte';
    import Header from '../components/Header.svelte';
    import { navigate } from "svelte-routing";

    const info = 
        {
            header: 'Create and store device digital identity',
            content:
                'Share device credentials and immunity status safely and privately using IOTA’s Identity solution.',
            footer: 'Next'
        };

    function onNext() {
        navigate('name');
    }
</script>

<style>
    main {
        height: 100%;
        background: #F8F8F8;
        flex-direction: column;
        display: flex;
        flex: 1;
    }

    .content {
        text-align: center;
        align-items: center;
        width: 100%;
        padding: 0 3.4vh;
    }

    .content > img {
        mix-blend-mode: multiply;
        width: 25.8vh;
        height: 25.8vh;
        margin: 7.6vh 0 1.3vh 0;
    }

    .info {
        font-family: 'Proxima Nova', sans-serif;
        font-style: normal;
        font-weight: 400;
        font-size: 2.08vh;
        line-height: 3.3vh;
        color: #6f7a8d;
        text-align: center;
    }

    .headerContainer {
        display: flex;
        flex: 0.5;
    }

    .contentContainer {
        display: flex;
        flex: 1;
    }

    .footerContainer {
        display: flex;
        align-self: flex-end;
        width: 100%;
        margin-top: 7.5vh;
    }
</style>

<main id="wrapper">
    <div class="headerContainer">
        <Header text="{info.header}" />
    </div>
    <div class="contentContainer">
        <div class="content">
            <img src="../assets/landing-1.png" alt="landing-1" />
            <p class="info">{info.content}</p>
        </div>
    </div>
    <footer class="footerContainer">
        <Button style="background: #00A7FF; color: white;" label="{info.footer}" onClick="{onNext}" />
    </footer>
</main>
