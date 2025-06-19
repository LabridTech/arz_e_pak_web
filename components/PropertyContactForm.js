"use client"

import * as React from "react"
import { Phone, Mail } from 'lucide-react'
import { useForm } from "react-hook-form"
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import CircularProgress from '@mui/material/CircularProgress'

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"

export default function PropertyContactForm() {
  const form = useForm({
    defaultValues: {
      message: "I would like to inquire about your property Zameen - ID51778652. Please contact me at your earliest convenience.",
      userType: "buyer",
      keepInformed: false,
      phone: '',
    },
  })
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(data) {
    setLoading(true);
    try {
      // Handle form submission
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network
      console.log(data)
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-2xl font-bold text-gray-900">PKR 7.8 Crore</h2>
      
      {/* Action Buttons */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          className="flex items-center gap-2 border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
          onClick={() => window.open("https://wa.me/+92", "_blank")}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 fill-current"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          WhatsApp
        </Button>
        <Button
          variant="default"
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
        >
          <Phone className="h-5 w-5" />
          Call
        </Button>
      </div>

      {/* Contact Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="NAME*" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="EMAIL*" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <PhoneInput
                    country={'pk'}
                    value={field.value}
                    onChange={field.onChange}
                    inputProps={{
                      name: 'phone',
                      required: true,
                      autoFocus: false
                    }}
                    inputStyle={{ width: '100%' }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="MESSAGE*"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="userType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>I am a:</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="buyer" id="buyer" />
                      <label htmlFor="buyer">Buyer/Tenant</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="agent" id="agent" />
                      <label htmlFor="agent">Agent</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <label htmlFor="other">Other</label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="keepInformed"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Keep me informed about similar properties.
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full flex items-center gap-2 bg-green-600 hover:bg-green-700" disabled={loading}>
            {loading ? <CircularProgress size={20} color="inherit" /> : <Mail className="h-5 w-5" />}
            {loading ? 'Sending...' : 'SEND EMAIL'}
          </Button>
        </form>
      </Form>
    </div>
  )
}

