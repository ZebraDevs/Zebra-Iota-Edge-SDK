<script>
    export let onClick;
    export let heading;
    export let subheading;
</script>

<li on:click={onClick}>
    <span class="icon">
        <img class="arrow" src="../assets/landing-3.png" alt="landing-3" />
    </span>
    <div>
        <h5>{heading}</h5>
        <h6>{subheading}</h6>
    </div>
    <img class="arrow" src="../assets/chevron-right.svg" alt="chevron-right" />
</li>

<style>
    li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #ffffff;
        box-shadow: 0px 4px 12px rgba(217, 225, 238, 0.3);
        padding: 2vh 6vw;
    }

    .icon {
        height: 14vw;
        width: 14vw;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        background-color: #f8f8f8;
    }

    .icon > img {
        max-width: 100%;
        max-height: 100%;
    }

    div {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        flex: 1;
        margin-left: 5vw;
        margin-right: 5vw;
    }

    h5 {
        font-family: "Proxima Nova", sans-serif;
        font-weight: 600;
        font-size: 2.7vw;
        line-height: 4vw;
        letter-spacing: 0.06em;
        color: #8593ac;
        text-transform: uppercase;
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin: 0 0 0.9vh 0;
    }

    h6 {
        font-family: "Proxima Nova", sans-serif;
        font-weight: 600;
        font-size: 4vw;
        line-height: 3.4vw;
        margin: 0;
        color: #051923;
    }
</style>
