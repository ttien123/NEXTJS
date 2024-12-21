'use client'

import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useLocale, useTranslations } from "next-intl"
import { Locale, locales } from "@/i18n/config"
import { setUserLocale } from "@/services/locale"

export function SwitchLanguage() {
    const t = useTranslations('SwitchLanguage')
    const locale = useLocale()
    return (
        <Select value={locale} onValueChange={(value) => {
            setUserLocale(value as Locale)
        }}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('title')} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {locales.map((locale) => (
                    <SelectItem key={locale} value={locale}>
                        {t(locale)}
                    </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
