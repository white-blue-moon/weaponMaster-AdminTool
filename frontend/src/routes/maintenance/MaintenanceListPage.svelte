<script>
    import { API } from '../../constants/api'
    import { apiFetch, handleApiError } from '../../utils/apiFetch'
    import { onMount } from "svelte"
    import { MAINTENANCE_STATE, MAINTENANCE_STATE_TEXT } from '../../constants/settingState'
    import { PATHS } from '../../constants/paths'
    
    import Gnb from "../../components/Gnb.svelte"
    import VisualBanner from "../../components/VisualBanner.svelte"
    import AccessList from "../../components/AccessList.svelte"
    import Footer from "../../components/Footer.svelte"
  

    let settings = null

    const getStateClass = (state) => {
        switch (state) {
            case MAINTENANCE_STATE.OFF:   return "state-off"
            case MAINTENANCE_STATE.ON:    return "state-on"
            default: return ""
        }
    }

    onMount(async () => {
        const response = await apiFetch(API.MAINTENANCE.LIST, {
            method: "GET",
        }).catch(handleApiError)

        if (response != null) {
            settings  = response.maintenanceList.reduce((acc, item) => {
                acc.push({
                    id:          item.id,
                    state:       item.active_state,
                    title:       item.comment,
                    start_date:  item.start_date,
                    end_date:    item.end_date,
                    create_date: item.create_date,          
                })

                return acc
            }, [])
        }
    })
</script>


{#if settings != null}
    <Gnb />
    <VisualBanner background="/img/svisual5.jpg" title="홈페이지 점검 상태 제어"/>
    <AccessList 
        settings={ settings }
        state={ MAINTENANCE_STATE }
        stateText={ MAINTENANCE_STATE_TEXT }
        getStateClass={ getStateClass }
        hrefBase={ PATHS.MAINTENANCE }
    />
    <Footer />
{/if}


<style>

</style>
