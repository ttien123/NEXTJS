import dishApiRequest from '@/apiRequests/dish'
import { DishListResType } from '@/schemaValidations/dish.schema'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { getTranslations, setRequestLocale } from'next-intl/server'
import { generateSlugUrl, htmlToTextForDescription } from '@/lib/utils'
import { Locale } from '@/i18n/config'

export async function generateMetadata(props: {
  params: { locale: Locale }
}) {
  const params = props.params

  const { locale } = params

  const t = await getTranslations({ locale, namespace: 'HomePage' })

  return {
    title: t('title'),
    description: htmlToTextForDescription(t('description')),
  }
}


export default async function Home(props: {
  params: { locale: string }
}) {
  const params = props.params

  const { locale } = params

  setRequestLocale(locale)
  const t = await getTranslations('HomePage')
  let dishList: DishListResType['data'] = []
  try {
    const result = await dishApiRequest.list()
    const { payload: { data } } = result
    dishList = data
  } catch (error) {
    return <div>Something went wrong</div>
  }
  return (
    <div className='w-full space-y-4'>
      <section className='relative'>
        <span className='absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10'></span>
        <Image
          src='/banner.png'
          width={400}
          height={200}
          quality={100}
          alt='Banner'
          className='absolute top-0 left-0 w-full h-full object-cover'
        />
        <div className='z-20 relative py-10 md:py-20 px-4 sm:px-10 md:px-20'>
          <h1 className='text-center text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold'>{t('title')}</h1>
          <p className='text-center text-sm sm:text-base mt-4'>Vị ngon, trọn khoảnh khắc</p>
        </div>
      </section>
      <section className='space-y-10 py-16'>
        <h2 className='text-center text-2xl font-bold'>Đa dạng các món ăn</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-10'>
          {dishList.map((dish) => (
              <Link href={`/dishes/${generateSlugUrl({ name: dish.name, id: dish.id })}`} className='flex gap-4 w' key={dish.id}>
                <div className='flex-shrink-0'>
                  <Image
                    width={150}
                    height={150}
                    alt={dish.name}
                    src={dish.image}
                    className='object-cover w-[150px] h-[150px] rounded-md'
                  />
                </div>
                <div className='space-y-1'>
                  <h3 className='text-xl font-semibold'>{dish.name}</h3>
                  <p className=''>{dish.description}</p>
                  <p className='font-semibold'>{dish.price}</p>
                </div>
              </Link>
            ))}
        </div>
      </section>
    </div>
  )
}
