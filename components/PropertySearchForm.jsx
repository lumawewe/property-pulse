'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const PropertySearchForm = () => {
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('All');
  const [neighbourhood, setNeighbourhood] = useState('All');

  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (location === '' && propertyType === 'All' && neighbourhood === 'All') {
      router.push('/properties');
    } else {
      const query = `?location=${location}&propertyType=${propertyType}&neighbourhood=${neighbourhood}`;

      router.push(`/properties/search-results${query}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='mt-3 mx-auto max-w-2xl w-full flex flex-col md:flex-row items-center'
    >
      <div className='w-full md:w-3/5 md:pr-2 mb-4 md:mb-0'>
        <label htmlFor='location' className='sr-only'>
          Location
        </label>
        <input
          type='text'
          id='location'
          placeholder='Enter Keywords or Location'
          className='w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring focus:ring-blue-500'
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      <div className='w-full md:w-2/5 md:pl-2'>
        <label htmlFor='property-type' className='sr-only'>
          Property Type
        </label>
        <select
          id='property-type'
          className='w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring focus:ring-blue-500'
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
        >
          <option value="Urban Studio Retreats" title="Studios modernos e compactos ideais para solteiros ou jovens casais que buscam praticidade e estilo em um espaço otimizado.">Urban Studio Retreats</option>
          <option value="Comfort 2-Bedroom Apartments" title="Apartamentos de 2 quartos que oferecem espaço e conforto para pequenas famílias ou grupos de amigos, combinando design elegante com funcionalidades práticas.">Comfort 2-Bedroom Apartments</option>
          <option value="Luxury 3-Bedroom Residences" title="Residências de 3 quartos que proporcionam um ambiente espaçoso e sofisticado, perfeito para famílias maiores ou profissionais que necessitam de espaço adicional para home office ou hobbies.">Luxury 3-Bedroom Residences</option>
        </select>
      </div>
      <div className='w-full md:w-2/5 md:pl-2'>
        <label htmlFor='property-neighbourhood' className='sr-only'>
          Property Neighbourhood
        </label>
        <select
          id='property-neighbourhood'
          className='w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring focus:ring-blue-500'
          value={neighbourhood}
          onChange={(e) => setNeighbourhood(e.target.value)}
        >
          <option value="Jardim Paulista">Jardim Paulista</option>
          <option value="Pinheiros">Pinheiros</option>
          <option value="Vila Madalena">Vila Madalena</option>
          <option value="Moema">Moema</option>
          <option value="Brooklin">Brooklin</option>
          <option value="Itaim Bibi">Itaim Bibi</option>
          <option value="Higienópolis">Higienópolis</option>
          <option value="Consolação">Consolação</option>
          <option value="Bela Vista">Bela Vista</option>
        </select>
      </div>
      <button
        type='submit'
        className='md:ml-4 mt-4 md:mt-0 w-full md:w-auto px-6 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-500'
      >
        Search
      </button>
    </form>
  );
};

export default PropertySearchForm;
