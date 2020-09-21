import React, { useCallback, useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { useMutation } from 'react-query'

import { withTranslation } from '@/i18n/instance'
import basicFetch from '@/utils/basicFetch'
import { searchOffer } from '@/consts/urls'
import OfferList from '@/features/offer/OfferList'

import SearchForm from '../components/SearchForm'
import { omitUndefined } from '@/utils/dataOptimization'

const SearchFormContainer = ({ t }) => {
  const [mutate, { isLoading, data }] = useMutation(
    basicFetch(searchOffer, 'GET'))
  const [offers, setOffers] = useState([])
  const [offersInfo, setOffersInfo] = useState({})
  const [formData, setFormData] = useState({})
  const [chipLabels, setChipLabels] = useState(new Map())

  const formik = useFormik({
    initialValues: {
      type: 'flat',
      country: 1,
      limit: 10,
      active: true,
      priceSellMin: 0,
      priceSellMax: 20000000,
      spaceMin: 0,
      spaceMax: 200,
    },
    onSubmit: formData => {
      setOffers([])
      setOffersInfo({})
      setFormData(formData)
      return mutate(omitUndefined(formData))
    },
  })

  formik.setChipLabel = (name, label) => setChipLabels(pairs => new Map(pairs.set(name, label)))

  console.log('labelValues:', [...chipLabels.entries()])

  const validate = values => {
    const errors = {}
    if (!values.email) {
      errors.email = 'Required'
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
    ) {
      errors.email = 'Invalid email address'
    }
    return errors
  }

  const fetchMore = useCallback((limit, offset) => mutate({
    ...formData,
    limit,
    offset,
  }), [formData])

  useEffect(() => {
    if (!data) {
      return
    }
    setOffers(offers => ([...offers, ...Object.values(data.results)]))
    setOffersInfo(data.info)
  }, [data])

  return (
    <>
      <SearchForm
        t={t}
        formik={formik}
        isLoading={isLoading}
        validate={validate}
      />
      <OfferList
        isLoading={isLoading}
        fetchMore={fetchMore}
        offers={offers}
        offersInfo={offersInfo}
      />
    </>
  )
}

export default withTranslation('searchForm')(SearchFormContainer)