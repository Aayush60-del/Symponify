# Framer Motion + ShadCN/UI API Reference

## Animation System (`lib/animations.js`)

### Page Transitions
```javascript
// Fade in + slide down effect
pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

// Simple fade in/out
fadeInVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
}

// Slide from left
slideInLeftVariants = { /* x: -100% → 0 */ }

// Slide from right
slideInRightVariants = { /* x: 100% → 0 */ }

// Slide from bottom
slideInUpVariants = { /* y: 100% → 0 */ }
```

**Usage:**
```javascript
<motion.div
  variants={pageVariants}
  initial="initial"
  animate="animate"
  exit="exit"
>
  {/* page content */}
</motion.div>
```

### Container & List Animations
```javascript
// Stagger children with delay
containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

// Individual item animation
itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}
```

**Usage:**
```javascript
<motion.div variants={containerVariants} initial="hidden" animate="visible">
  {items.map(item => (
    <motion.div key={item.id} variants={itemVariants}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### Interaction Animations
```javascript
// Scale on hover
hoverScaleVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.98 }
}

// Lift on hover
hoverYVariants = {
  initial: { y: 0 },
  hover: { y: -8 },
  tap: { y: -4 }
}

// Button tap effect
buttonTapVariants = {
  initial: { scale: 1 },
  tap: { scale: 0.98 }
}

// Card hover with shadow
cardHoverVariants = {
  initial: { y: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  hover: { y: -8, boxShadow: '0 20px 25px rgba(0,0,0,0.15)' }
}
```

**Usage:**
```javascript
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.98 }}
  onClick={handleClick}
>
  Click me
</motion.button>
```

### Modal & Overlay Animations
```javascript
// Scale from small to full size
modalVariants = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.95, opacity: 0 }
}

// Slide from left
drawerVariants = {
  initial: { x: '-100%', opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: '-100%', opacity: 0 }
}

// Fade backdrop
backdropVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
}
```

**Usage:**
```javascript
<AnimatePresence>
  {isOpen && (
    <>
      <motion.div variants={backdropVariants} {...} onClick={onClose} />
      <motion.div variants={modalVariants} {...}>
        {/* modal content */}
      </motion.div>
    </>
  )}
</AnimatePresence>
```

### Loading & Loading State Animations
```javascript
// Rotating spinner
rotateVariants = {
  animate: {
    rotate: 360,
    transition: { duration: 2, repeat: Infinity, ease: 'linear' }
  }
}

// Pulsing opacity
pulseVariants = {
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: { duration: 2, repeat: Infinity }
  }
}
```

**Usage:**
```javascript
<motion.div variants={rotateVariants} animate="animate">
  Loading...
</motion.div>
```

### Accordion Animations
```javascript
// Expand/collapse with height animation
accordionContentVariants = {
  collapsed: { height: 0, opacity: 0 },
  expanded: { height: 'auto', opacity: 1 }
}
```

### Transition Presets
```javascript
// Smooth easing (cubic-bezier)
transitionPresets.smooth = {
  duration: 0.5,
  ease: [0.22, 1, 0.36, 1]
}

// Fast transition
transitionPresets.fast = {
  duration: 0.2,
  ease: [0.22, 1, 0.36, 1]
}

// Slow transition
transitionPresets.slow = {
  duration: 1,
  ease: [0.22, 1, 0.36, 1]
}
```

---

## Accessibility Utilities (`lib/animation-utils.js`)

### useReducedMotion Hook
```javascript
import { useReducedMotion } from '../lib/animation-utils'

function MyComponent() {
  const prefersReducedMotion = useReducedMotion()
  
  return (
    <motion.div
      animate={prefersReducedMotion ? {} : animationVariants}
    />
  )
}
```

**Returns:** `boolean` - true if user has `prefers-reduced-motion: reduce` enabled

### createAccessibleTransition Helper
```javascript
import { createAccessibleTransition } from '../lib/animation-utils'

const transition = createAccessibleTransition(
  prefersReducedMotion, 
  { duration: 0.5 }
)
// Returns 0.01 if prefersReducedMotion is true, else 0.5
```

### usePageTransition Hook
```javascript
import { usePageTransition } from '../lib/animation-utils'

function Page() {
  const transition = usePageTransition()
  
  return (
    <motion.div
      variants={pageVariants}
      transition={transition}
    />
  )
}
```

---

## Toast Notifications (`context/ToastContext.jsx`)

### useToast Hook
```javascript
import { useToast } from '../context/ToastContext'

function MyComponent() {
  const { success, error, warning, info, addToast, removeToast } = useToast()
  
  // Simple shortcuts
  success('Saved successfully!')          // auto-dismiss after 3s
  error('Something went wrong')           // auto-dismiss after 5s
  warning('Are you sure?')                // auto-dismiss after 4s
  info('Just so you know...')            // auto-dismiss after 3s
  
  // Custom
  addToast('Custom message', 'info', 6000)
  
  // Manual removal
  const toastId = addToast('Manual toast', 'success', 0) // 0 = no auto-dismiss
  removeToast(toastId)
}
```

### Toast Types
- `success` - Green background, checkmark icon
- `error` - Red background, X icon
- `warning` - Yellow background, warning icon
- `info` - Blue background, info icon
- `default` - Gray background, no icon

### Toast Component
Auto-renders at fixed top-right position when ToastProvider is at app root.

---

## Skeleton Loaders (`components/Skeleton.jsx`)

### Base Skeleton
```javascript
import { Skeleton } from '../components/Skeleton'

<Skeleton className="w-12 h-12 rounded-full" />
```

### SongRowSkeleton
```javascript
import { SongRowSkeleton } from '../components/Skeleton'

<SongRowSkeleton />
// Shows: index + cover + title + artist + duration skeleton
```

### AlbumCardSkeleton
```javascript
import { AlbumCardSkeleton } from '../components/Skeleton'

<AlbumCardSkeleton />
// Shows: album cover + title + artist skeleton
```

### SkeletonList
```javascript
import { SkeletonList, SongRowSkeleton } from '../components/Skeleton'

<SkeletonList count={5} children={<SongRowSkeleton />} />
// Shows 5 song row skeletons
```

### SkeletonWrapper
```javascript
import { SkeletonWrapper, SongRowSkeleton } from '../components/Skeleton'

<SkeletonWrapper
  isLoading={loading}
  skeleton={<SongRowSkeleton />}
>
  {/* actual content */}
  <SongRow song={song} />
</SkeletonWrapper>
```

---

## Motion Wrapper Components (`components/motion/MotionWrappers.jsx`)

### AnimatedPage
```javascript
import { AnimatedPage } from '../components/motion/MotionWrappers'

<AnimatedPage>
  {/* page content */}
</AnimatedPage>
```
- Applies pageVariants with fade + slide
- Respects prefers-reduced-motion

### AnimatedContainer
```javascript
import { AnimatedContainer } from '../components/motion/MotionWrappers'

<AnimatedContainer>
  {/* staggered children */}
</AnimatedContainer>
```
- Staggered children animations
- 0.1s delay between items

### AnimatedList & AnimatedListItem
```javascript
import { AnimatedList, AnimatedListItem } from '../components/motion/MotionWrappers'

<AnimatedList>
  {items.map(item => (
    <AnimatedListItem key={item.id}>
      {item.content}
    </AnimatedListItem>
  ))}
</AnimatedList>
```
- List item animations with stagger

### FadeIn
```javascript
import { FadeIn } from '../components/motion/MotionWrappers'

<FadeIn>
  {/* fades in on mount */}
</FadeIn>
```

### HoverScale
```javascript
import { HoverScale } from '../components/motion/MotionWrappers'

<HoverScale scale={1.05}>
  {/* scales on hover */}
</HoverScale>
```

### SkeletonWrapper
```javascript
import { SkeletonWrapper } from '../components/motion/MotionWrappers'

<SkeletonWrapper
  isLoading={loading}
  skeleton={<MySkeleton />}
>
  {/* actual content */}
</SkeletonWrapper>
```

---

## UI Components (`components/ui/`)

### Button
```javascript
import { Button } from '../components/ui'

// Variants: default, outline, ghost, secondary, destructive, link
<Button variant="default">Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="destructive">Delete</Button>

// Sizes: sm, md, lg, icon
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>

// With motion
<Button asMotion whileHover={{ scale: 1.05 }}>
  Animated
</Button>

// Disabled state
<Button disabled>Disabled</Button>

// Full width
<Button className="w-full">Full Width</Button>
```

### Badge
```javascript
import { Badge } from '../components/ui'

// Variants: default, primary, secondary, success, warning, error, info
<Badge variant="success">Active</Badge>
<Badge variant="error">Failed</Badge>
<Badge variant="warning">Pending</Badge>

// Sizes: sm, md, lg
<Badge size="sm">Small Badge</Badge>
<Badge size="lg">Large Badge</Badge>

// Custom styling
<Badge className="custom-class">Custom</Badge>
```

### Card Family
```javascript
import { 
  Card, CardHeader, CardTitle, CardDescription, 
  CardContent, CardFooter 
} from '../components/ui'

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* main content */}
  </CardContent>
  <CardFooter>
    {/* footer actions */}
  </CardFooter>
</Card>
```

### Input
```javascript
import { Input } from '../components/ui'

<Input 
  type="email"
  placeholder="Enter email"
  value={value}
  onChange={handleChange}
/>

// With className
<Input className="w-full" />

// Disabled
<Input disabled />
```

### Textarea
```javascript
import { Textarea } from '../components/ui'

<Textarea 
  placeholder="Enter message"
  value={value}
  onChange={handleChange}
  rows={5}
/>

// With className
<Textarea className="w-full" />
```

---

## Common Patterns

### Pattern 1: Animated Form
```javascript
<motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
  <Input placeholder="..." />
  <Button type="submit">Submit</Button>
</motion.form>
```

### Pattern 2: Loading List
```javascript
<SkeletonWrapper isLoading={loading} skeleton={<SongRowSkeleton />}>
  {songs.map(song => <SongRow key={song._id} song={song} />)}
</SkeletonWrapper>
```

### Pattern 3: Hover Card
```javascript
<motion.div whileHover="hover" variants={cardHoverVariants}>
  <Card>
    {/* card content */}
  </Card>
</motion.div>
```

### Pattern 4: Staggered List
```javascript
<AnimatedList>
  {items.map(item => (
    <AnimatedListItem key={item.id}>
      {item.name}
    </AnimatedListItem>
  ))}
</AnimatedList>
```

### Pattern 5: Modal with Toast
```javascript
const { success, error } = useToast()

const handleConfirm = async () => {
  try {
    await apiCall()
    success('Success!')
    onClose()
  } catch (err) {
    error('Failed!')
  }
}
```

---

## Props Reference

### motion.div Props
```javascript
<motion.div
  initial={{ opacity: 0 }}           // Starting state
  animate={{ opacity: 1 }}           // Target state
  exit={{ opacity: 0 }}              // Exit state
  transition={{ duration: 0.5 }}     // Animation duration
  variants={{ /* animation objects */ }}  // Named animation states
  whileHover={{ scale: 1.05 }}       // Hover state
  whileTap={{ scale: 0.95 }}         // Tap/click state
  onClick={handleClick}              // Event handler
  className="..."                     // Tailwind classes
>
  {children}
</motion.div>
```

### Component Props
```javascript
// Button
<Button 
  variant="default"    // outline, ghost, secondary, destructive, link
  size="md"            // sm, md, lg, icon
  disabled={false}
  asMotion={true}      // Enable motion animations
  className=""
  onClick={fn}
/>

// Input/Textarea
<Input
  type="email"
  placeholder="..."
  value=""
  onChange={fn}
  disabled={false}
  className=""
/>

// Card
<Card className="">
  <CardContent>
    {children}
  </CardContent>
</Card>
```

---

## Dark Mode Classes

All components use Tailwind dark mode prefix:

```javascript
className="bg-white dark:bg-gray-800"
className="text-gray-900 dark:text-white"
className="border-gray-300 dark:border-gray-600"
```

Enable dark mode in `tailwind.config.js`:
```javascript
module.exports = {
  darkMode: 'class',  // or 'media'
  // ...
}
```

---

## Testing Animation Accessibility

### Disable animations in browser DevTools:
1. Open DevTools
2. Press Ctrl+Shift+P (Cmd+Shift+P on Mac)
3. Type "Rendering"
4. Select "Show Rendering"
5. Check "Emulate CSS media feature prefers-reduced-motion"

**Expected behavior:** All animations should disable instantly

---

## Performance Tips

1. **Use transform & opacity only** - GPU accelerated
2. **Avoid animating width/height** - Use scale or max-height instead
3. **Limit stagger children** - Avoid animating too many items at once
4. **Use `layout` prop sparingly** - It's expensive for layout recalculation
5. **Test on mobile** - Use DevTools throttling to simulate slower devices

---

## Debugging

### Animation not running?
- Check `initial`, `animate`, `exit` props are set
- Verify component is motion-wrapped (motion.div, motion.button, etc.)
- Check prefers-reduced-motion isn't enabled
- Use browser DevTools to inspect animation state

### Performance issues?
- Chrome DevTools → Performance → Record
- Look for dropped frames (non-60fps)
- Check for main thread blocking
- Reduce number of animating elements

### Styling issues?
- Verify Tailwind CSS is imported
- Check dark mode is configured
- Use `!important` only as last resort
- Test in both light and dark modes

---

**Reference Version:** 1.0
**Last Updated:** 2024
**Status:** Complete API Documentation
