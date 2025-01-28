<script>
    import { API } from '../../constants/api'
    import { apiFetch, handleApiError } from '../../utils/apiFetch'
    import { onMount } from "svelte"
    import { ACCESS_LEVEL, ACCESS_LEVEL_TEXT } from '../../constants/settingState'
    import { PATHS } from '../../constants/paths'
    
    import Gnb from "../../components/Gnb.svelte"
    import VisualBanner from "../../components/VisualBanner.svelte"
    import AccessList from "../../components/AccessList.svelte"
    import Footer from "../../components/Footer.svelte"
  

    let settings = null

    const getStateClass = (state) => {
        switch (state) {
            case ACCESS_LEVEL.NORMAL:   return "access-normal"
            case ACCESS_LEVEL.ADMIN:    return "access-admin"
            default: return ""
        }
    }

    onMount(async () => {
        const response = await apiFetch(API.ACCESS_LEVEL.LIST, {
            method: "GET",
        }).catch(handleApiError)

        if (response != null) {
            settings  = response.userInfoList.reduce((acc, item) => {
                acc.push({
                    id:          item.id,
                    state:       item.user_type,
                    title:       item.user_id,
                    create_date: item.join_date,          
                })

                return acc
            }, [])
        }

        console.log('before settings: ', settings)
    })
</script>

{#if settings != null}
    <Gnb />
    <VisualBanner background="/img/svisual3.jpg" title="접근 권한 관리"/>
    <AccessList 
        settings={ settings }
        state={ ACCESS_LEVEL }
        stateText={ ACCESS_LEVEL_TEXT }
        getStateClass={ getStateClass }
        hrefBase={ PATHS.ACCESS_LEVEL }
    />
    <Footer />
{/if}

<style>
    :global(.access-admin) {
        color:#e0aa00 !important
    }
</style>