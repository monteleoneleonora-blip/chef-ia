/**
 * RobotBubble — Robot avec bulle de dialogue
 *
 * Props:
 *   expression : voir RobotChef
 *   size       : voir RobotChef
 *   message    : string | ReactNode
 *   side       : 'right' (bulle à droite du robot) | 'left'
 *   variant    : 'tip' | 'info' | 'success' | 'warning' | 'default'
 *   animate    : boolean — fait rebondir le robot
 */
import RobotChef from './RobotChef'
import { cn } from '@/lib/utils'

const BUBBLE_VARIANTS = {
  default: 'bg-white border-border text-foreground',
  tip:     'bg-emerald-50 border-emerald-200 text-emerald-900',
  info:    'bg-sky-50 border-sky-200 text-sky-900',
  success: 'bg-emerald-50 border-emerald-300 text-emerald-900',
  warning: 'bg-amber-50 border-amber-200 text-amber-900',
}

export default function RobotBubble({
  expression = 'idle',
  size = 'md',
  message,
  side = 'right',
  variant = 'default',
  animate = false,
  accessory = 'spatula',
  className,
}) {
  const bubbleClass = BUBBLE_VARIANTS[variant] ?? BUBBLE_VARIANTS.default

  return (
    <div className={cn(
      'flex items-end gap-3',
      side === 'left' && 'flex-row-reverse',
      className
    )}>
      {/* Robot */}
      <div className={cn(
        'shrink-0 transition-transform',
        animate && 'animate-bounce'
      )}>
        <RobotChef expression={expression} size={size} accessory={accessory} />
      </div>

      {/* Bulle */}
      {message && (
        <div className={cn(
          'relative max-w-xs rounded-2xl border px-4 py-3 shadow-sm',
          side === 'right' ? 'rounded-bl-sm' : 'rounded-br-sm',
          bubbleClass
        )}>
          {typeof message === 'string' ? (
            <p className="text-sm leading-relaxed">{message}</p>
          ) : message}

          {/* Queue de la bulle */}
          <div
            className={cn(
              'absolute -bottom-2 w-4 h-4 border-b border-r rotate-45',
              side === 'right' ? 'left-2' : 'right-2',
              bubbleClass
            )}
          />
        </div>
      )}
    </div>
  )
}
