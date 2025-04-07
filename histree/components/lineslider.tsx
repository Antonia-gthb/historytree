import type React from "react"
import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"


type SliderProps = React.ComponentProps<typeof Slider>

export default function SliderScaling ({ className, ...props }: SliderProps) {
  return <Slider className={cn("w-[15%]", className)} {...props} />
}
