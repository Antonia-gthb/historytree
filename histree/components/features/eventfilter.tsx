"use client"

import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useEffect } from "react"
import useGlobalContext from "@/app/Context"
//text abc.


interface EventfilterProps {
  items?: string[] | undefined,
  selectedItems: string[],
  onSubmit: (selected: string[]) => void,
  onReset?: () => void
}

export function Eventfilter({ items = [], selectedItems, onSubmit, onReset }: EventfilterProps) {

  const { geneticEventsName } = useGlobalContext();


  const form = useForm<{ items: string[] }>({
    defaultValues: { items: geneticEventsName },
  });

  useEffect(() => {
    form.reset({ items: selectedItems });
  }, [selectedItems, form, geneticEventsName]);

  function handleSubmit(data: { items: string[] }) {
    onSubmit(data.items)
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="items"
          render={({ field }) => (
            <FormItem>
              <div className="mb-2">
                <FormDescription>
                  Select the genetic events you want to see in the MHN History Tree
                </FormDescription>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {items?.map((item) => {
                  const isChecked = field.value?.includes(item);

                  return (
                    <FormItem
                      key={item}
                      id={item}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={(checked) => {
                            const newValue = checked
                              ? [...(field.value ?? []), item]
                              : (field.value ?? []).filter((i) => i !== item)

                            field.onChange(newValue)
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">{item}</FormLabel>
                    </FormItem>
                  )
                })}
              </div>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex space-x-8">
          <Button type="submit" className="ease-in-out hover:-translate-y-1">Submit</Button>
          <Button type="button" className="ease-in-out hover:-translate-y-1"
            onClick={() => {
              form.reset({ items: items }); // 
              onReset?.();
            }}

          >
            Reset
          </Button>
        </div>
      </form>
    </Form>
  )
}      
