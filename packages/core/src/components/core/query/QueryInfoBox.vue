<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';
import type { QueryBase } from '../../../domains';
import { ConnectionPeerStatus } from '../../../domains';

export default defineComponent({
    props: {
        entity: {
            type: Object as PropType<QueryBase>,
            required: true,
        },
        link: {
            type: String,
            required: true,
        },
    },
    setup(props) {
        const hasFailed = computed(() => {
            for (let i = 0; i < props.entity.peers.length; i++) {
                if (props.entity.peers[i].status === ConnectionPeerStatus.OFFLINE) {
                    return true;
                }
            }

            return false;
        });

        return {
            hasFailed,
        };
    },
});
</script>
<template>
    <template v-if="hasFailed">
        <div class="alert alert-sm alert-warning">
            Einer oder mehrere Knoten konnten die Anfrage nicht ordnungsgemäß bearbeiten.
            Klicke <VCLink :href="link">
                hier
            </VCLink> für nähere Informationen.
        </div>
    </template>
</template>
