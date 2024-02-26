<template>
    <v-container class="settings-page white--text" ma-0 pa-0 fluid>
        <v-sheet color="rgba(0, 0, 0, 0.35)" class="pa-3 col-md-10 mx-auto">

            <div class="h4 mb-4">
                <v-card-title class="text-center white--text subtitle-1">
                    {{ this.$t(`shared.selectCompetitionSettings`) }}
                </v-card-title>
            </div>
            <v-row class="mt-0">
                <v-col cols="8" offset="2">
                    <v-text-field v-model="telegramLink" label="Telegram" prepend-icon="mdi-telegram" dark
                        hide-details></v-text-field>
                    <v-text-field v-model="facebookLink" label="Facebook" prepend-icon="mdi-facebook" dark
                        hide-details></v-text-field>
                    <v-text-field v-model="twitterLink" label="Twitter" prepend-icon="mdi-twitter" dark
                        hide-details></v-text-field>
                    <v-text-field v-model="youtubeLink" label="YouTube" prepend-icon="mdi-youtube" dark
                        hide-details></v-text-field>
                    <v-text-field v-model="instagramLink" label="Instagram" prepend-icon="mdi-instagram" dark
                        hide-details></v-text-field>
                    <v-text-field v-model="fpsuSiteLink" label="Сайт ФППСУ" prepend-icon="mdi-web" dark
                        hide-details></v-text-field>
                    <v-text-field v-model="liveStreamLink" label="Онлайн трансляція" prepend-icon="mdi-video" dark
                        hide-details></v-text-field>
                </v-col>
            </v-row>
            <v-divider color="white" class="mt-4" />
            <div class="mt-3 d-flex justify-space-between">
                <v-btn color="light-green white--text" @click="saveSettings">
                    Зберегти
                </v-btn>
                <v-btn color="white" @click="$router.push({ name: 'main' })">
                    Назад
                </v-btn>
            </div>
        </v-sheet>
    </v-container>
</template>
  
<script>
import axios from 'axios';

export default {
    data: function () {
        return {
            telegramLink: '',
            telegramId: '',
            facebookLink: '',
            facebookId: '',
            twitterLink: '',
            twitterId: '',
            youtubeLink: '',
            youtubeId: '',
            instagramLink: '',
            instagramId: '',
            fpsuSiteLink: '',
            fpsuSiteId: '',
            liveStreamLink: '',
            liveStreamId: '',
        };
    },
    mounted() {
        this.fetchSocialLinks();
    },
    methods: {
        async createSocialLink(link, linkType) {
            try {
                const response = await axios.post('private/social-network', { link, linkType });
                return response.data.id;
            } catch (error) {
                console.error(`Error creating social link of type ${linkType}:`, error);
            }
        },
        async fetchSocialLinks() {
            try {
                const response = await axios.get('public/social-network');
                const links = response.data;

                links.forEach(link => {
                    switch (link.linkType) {
                        case 'TELEGRAM':
                            this.telegramLink = link.link;
                            this.telegramId = link.id;
                            break;
                        case 'FACEBOOK':
                            this.facebookLink = link.link;
                            this.facebookId = link.id;
                            break;
                        case 'YOUTUBE':
                            this.youtubeLink = link.link;
                            this.youtubeId = link.id;
                            break;
                        case 'TWITTER':
                            this.twitterLink = link.link;
                            this.twitterId = link.id;
                            break;
                        case 'INSTAGRAM':
                            this.instagramLink = link.link;
                            this.instagramId = link.id;
                            break;
                        case 'COMMON':
                            this.fpsuSiteLink = link.link;
                            this.fpsuSiteId = link.id;
                            break;
                        case 'ONLINE_TRANSLATION':
                            this.liveStreamLink = link.link;
                            this.liveStreamId = link.id;
                            break;
                    }
                });
            } catch (error) {
                console.error('Error fetching social links:', error);
            }
        },
        saveSettings() {
            const links = [
                { id: this.telegramId, link: this.telegramLink, type: 'TELEGRAM' },
                { id: this.facebookId, link: this.facebookLink, type: 'FACEBOOK' },
                { id: this.youtubeId, link: this.youtubeLink, type: 'YOUTUBE' },
                { id: this.twitterId, link: this.twitterLink, type: 'TWITTER' },
                { id: this.instagramId, link: this.instagramLink, type: 'INSTAGRAM' },
                { id: this.fpsuSiteId, link: this.fpsuSiteLink, type: 'COMMON' },
                { id: this.liveStreamId, link: this.liveStreamLink, type: 'ONLINE_TRANSLATION' },
            ];

            links.forEach(({ id, link, type }) => {
                if (link) {
                    if (id) {
                        this.updateSocialLink(id, link);
                    } else {
                        this.createSocialLink(link, type);
                    }
                } else if (id) {
                    this.deleteSocialLink(id);
                }
            });
        },
        async updateSocialLink(id, link) {
            try {
                await axios.patch(`private/social-network/${id}`, { link });
            } catch (error) {
                console.error(`Error updating social link with id ${id}:`, error);
            }
        },
        async deleteSocialLink(id) {
            try {
                await axios.delete(`private/social-network/${id}`);
            } catch (error) {
                console.error(`Error deleting social link with id ${id}:`, error);
            }
        },
    },
};
</script>
  
<style lang="scss">
.settings-page {
    .v-text-field {
        margin-bottom: 20px;
    }
}
</style>
  