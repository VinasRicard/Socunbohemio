fetch('../res/concerts.json')
    .then((r) => r.json())
    .then((data) => {
        Vue.createApp({
            data() {
                return { concerts: data.concerts };
            },
        }).mount('#concerts-app');
    });
