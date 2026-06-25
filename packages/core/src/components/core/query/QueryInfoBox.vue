<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import { VCAlert } from '@vuecs/elements';
import { VCLink } from '@vuecs/link';
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';
import type { QueryBase } from '../../../domains';
import { ConnectionPeerStatus } from '../../../domains';

export default defineComponent({
    components: { VCAlert, VCLink },
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
            for (const peer of props.entity.peers) {
                if (peer.status === ConnectionPeerStatus.OFFLINE) {
                    return true;
                }
            }

            return false;
        });

        return { hasFailed };
    },
});
</script>
<template>
    <template v-if="hasFailed">
        <VCAlert
            color="warning"
            variant="soft"
            size="sm"
        >
            Einer oder mehrere Knoten konnten die Anfrage nicht ordnungsgemäß bearbeiten.
            Klicke <VCLink :href="link">
                hier
            </VCLink> für nähere Informationen.
        </VCAlert>
    </template>
</template>
