<template>
    <section class="container">
        <div class="content_setting">
            <h1>{{$t('setting.title')}}</h1>
            <div class="settingInputs">
                <div class="settingsRow">
                    <span>Dark Mode</span>
                    <v-switch v-model="darkMode" class="ma-2" color="green"></v-switch>
                </div>
                <div class="settingsRow">
                    <span>Notification</span>
                    <v-switch v-model="notification" class="ma-2" color="green"></v-switch>
                </div>
                <div class="settingsRow">
                    <span>Default Currency</span>
                    <span class="spanValue">USD</span>
                </div>
                <div class="settingsRow">
                    <span>Language</span>
                    <span class="spanValue">English</span>
                </div>
                <div class="settingsRow">
                    <span>Default Start Screen</span>
                    <span class="spanValue">News</span>
                </div>
            </div>
            <h1>{{$t('setting.title2')}}</h1>
            <div class="settingInputs">
                <div class="settingsRow">
                    <span>Chat with us on Discord</span>
                    <span class="spanValue"></span>
                </div>
                <div class="settingsRow">
                    <span>Follow us on Medium</span>
                    <span class="spanValue"></span>
                </div>
                <div class="settingsRow">
                    <span>Contact Us</span>
                    <span class="spanValue"></span>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    export default {
        name: "setting",
        data: () => {
            return {
                darkMode: false,
                notification: true,
            }
        }
    }
</script>

<style scoped>
    .content_setting{
        display: block;
        width: 100%;
        padding: 3%;
    }
    .content_setting>h1{
        font-size: 35px;
        font-weight: 500;
        margin-bottom: 15px;
    }
    .settingsRow{
        display: flex;
        width: 100%;
        align-items: baseline;
        justify-content: space-between;
        min-height: 50px;
    }
    .settingsRow>div{
        margin: 0px !important;
    }
    .settingsRow>span{
        font-size: 18px;
        font-weight: 500;
    }
    .spanValue{
        opacity: 0.5;
        padding-right: 6px;
    }
</style>
