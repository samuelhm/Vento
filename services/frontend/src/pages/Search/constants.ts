export type SpanishCapital = {
  id: string;
  name: string;
  lat: string;
  lng: string;
};

export const MADRID_CENTER = {
  lat: '40.4168',
  lng: '-3.7038',
};

export const DEFAULT_RADIUS_KM = '500';
export const MIN_RADIUS_KM = 1;
export const MAX_RADIUS_KM = 1000;
export const MADRID_CAPITAL_ID = 'madrid';

export const SPANISH_CAPITALS: SpanishCapital[] = [
  { id: 'albacete', name: 'Albacete', lat: '38.9943', lng: '-1.8585' },
  { id: 'alicante', name: 'Alicante', lat: '38.3452', lng: '-0.4810' },
  { id: 'almeria', name: 'Almeria', lat: '36.8340', lng: '-2.4637' },
  { id: 'avila', name: 'Avila', lat: '40.6565', lng: '-4.6810' },
  { id: 'badajoz', name: 'Badajoz', lat: '38.8794', lng: '-6.9707' },
  { id: 'barcelona', name: 'Barcelona', lat: '41.3851', lng: '2.1734' },
  { id: 'bilbao', name: 'Bilbao', lat: '43.2630', lng: '-2.9350' },
  { id: 'burgos', name: 'Burgos', lat: '42.3439', lng: '-3.6969' },
  { id: 'caceres', name: 'Caceres', lat: '39.4760', lng: '-6.3722' },
  { id: 'cadiz', name: 'Cadiz', lat: '36.5271', lng: '-6.2886' },
  { id: 'castellon-de-la-plana', name: 'Castellon de la Plana', lat: '39.9864', lng: '-0.0513' },
  { id: 'ciudad-real', name: 'Ciudad Real', lat: '38.9861', lng: '-3.9273' },
  { id: 'cordoba', name: 'Cordoba', lat: '37.8882', lng: '-4.7794' },
  { id: 'a-coruna', name: 'A Coruna', lat: '43.3623', lng: '-8.4115' },
  { id: 'cuenca', name: 'Cuenca', lat: '40.0704', lng: '-2.1374' },
  { id: 'girona', name: 'Girona', lat: '41.9794', lng: '2.8214' },
  { id: 'granada', name: 'Granada', lat: '37.1773', lng: '-3.5986' },
  { id: 'guadalajara', name: 'Guadalajara', lat: '40.6333', lng: '-3.1669' },
  { id: 'huelva', name: 'Huelva', lat: '37.2614', lng: '-6.9447' },
  { id: 'huesca', name: 'Huesca', lat: '42.1362', lng: '-0.4087' },
  { id: 'jaen', name: 'Jaen', lat: '37.7796', lng: '-3.7849' },
  { id: 'leon', name: 'Leon', lat: '42.5987', lng: '-5.5671' },
  { id: 'lleida', name: 'Lleida', lat: '41.6176', lng: '0.6200' },
  { id: 'logrono', name: 'Logrono', lat: '42.4627', lng: '-2.4449' },
  { id: 'lugo', name: 'Lugo', lat: '43.0121', lng: '-7.5559' },
  { id: 'madrid', name: 'Madrid', lat: '40.4168', lng: '-3.7038' },
  { id: 'malaga', name: 'Malaga', lat: '36.7213', lng: '-4.4214' },
  { id: 'murcia', name: 'Murcia', lat: '37.9922', lng: '-1.1307' },
  { id: 'ourense', name: 'Ourense', lat: '42.3358', lng: '-7.8639' },
  { id: 'oviedo', name: 'Oviedo', lat: '43.3614', lng: '-5.8593' },
  { id: 'palencia', name: 'Palencia', lat: '42.0097', lng: '-4.5288' },
  { id: 'palma', name: 'Palma', lat: '39.5696', lng: '2.6502' },
  { id: 'las-palmas-de-gran-canaria', name: 'Las Palmas de Gran Canaria', lat: '28.1235', lng: '-15.4363' },
  { id: 'pamplona', name: 'Pamplona', lat: '42.8125', lng: '-1.6458' },
  { id: 'pontevedra', name: 'Pontevedra', lat: '42.4310', lng: '-8.6444' },
  { id: 'salamanca', name: 'Salamanca', lat: '40.9701', lng: '-5.6635' },
  { id: 'san-sebastian', name: 'San Sebastian', lat: '43.3183', lng: '-1.9812' },
  { id: 'santa-cruz-de-tenerife', name: 'Santa Cruz de Tenerife', lat: '28.4636', lng: '-16.2518' },
  { id: 'santander', name: 'Santander', lat: '43.4623', lng: '-3.8099' },
  { id: 'segovia', name: 'Segovia', lat: '40.9429', lng: '-4.1088' },
  { id: 'sevilla', name: 'Sevilla', lat: '37.3891', lng: '-5.9845' },
  { id: 'soria', name: 'Soria', lat: '41.7662', lng: '-2.4790' },
  { id: 'tarragona', name: 'Tarragona', lat: '41.1189', lng: '1.2445' },
  { id: 'teruel', name: 'Teruel', lat: '40.3456', lng: '-1.1065' },
  { id: 'toledo', name: 'Toledo', lat: '39.8628', lng: '-4.0273' },
  { id: 'valencia', name: 'Valencia', lat: '39.4699', lng: '-0.3763' },
  { id: 'valladolid', name: 'Valladolid', lat: '41.6523', lng: '-4.7245' },
  { id: 'vitoria-gasteiz', name: 'Vitoria-Gasteiz', lat: '42.8467', lng: '-2.6716' },
  { id: 'zamora', name: 'Zamora', lat: '41.5035', lng: '-5.7468' },
  { id: 'zaragoza', name: 'Zaragoza', lat: '41.6488', lng: '-0.8891' },
];

export const SPANISH_CAPITAL_BY_ID: Record<string, SpanishCapital> = SPANISH_CAPITALS.reduce((acc, capital) => {
  acc[capital.id] = capital;
  return acc;
}, {} as Record<string, SpanishCapital>);
