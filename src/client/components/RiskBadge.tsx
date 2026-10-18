import React from 'react'
import type { RiskTier } from '../types'

interface Props {
    tier: RiskTier
    label?: string
    showDot?: boolean
}

const TIER_LABELS: Record<RiskTier, string> = {
    normal:   'Ready',
    medium:   'At Risk',
    high:     'High Risk',
    critical: 'Critical',
    unknown:  'Unknown',
}

export function RiskBadge({ tier, label, showDot }: Props) {
    const text = label ?? TIER_LABELS[tier]
    return (
        <span className={`cs-badge cs-badge--${tier}${showDot ? ' cs-badge--dot' : ''}`}>
            {text}
        </span>
    )
}
