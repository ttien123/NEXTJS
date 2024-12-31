'use client'

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useLocale, useTranslations } from "next-intl"
import { Locale, locales } from "@/i18n/config"
import { usePathname, useRouter } from "@/i18n/routing"

export function SwitchLanguage() {
    const t = useTranslations('SwitchLanguage')
    const locale = useLocale()
    const pathname = usePathname()
    const router = useRouter()
    return (
        <Select value={locale} onValueChange={(value) => {
            router.replace(pathname, {
                locale: value as Locale
            })
            router.refresh()
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
