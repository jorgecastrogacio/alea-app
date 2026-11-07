/**
 * Router de Catálogos Autonómicos de Bibliotecas Públicas de España (Coste $0).
 * Proporciona deep links directos por ISBN sin intermediarios ni caídas de servicio.
 */

export interface AutonomousCommunityCatalog {
  id: string;
  name: string;
  networkName: string;
  opacUrlBuilder: (isbn: string, title?: string) => string;
  notes?: string;
}

export const SPANISH_LIBRARY_NETWORKS: Record<string, AutonomousCommunityCatalog> = {
  madrid: {
    id: "madrid",
    name: "Comunidad de Madrid",
    networkName: "Red de Bibliotecas Públicas de la Comunidad de Madrid",
    opacUrlBuilder: (isbn: string) =>
      `https://gestiona3.madrid.org/bibpub_opac/abnetcl.cgi?ACC=101&PARAM1=${encodeURIComponent(
        isbn.replace(/[-\s]/g, "")
      )}&PARAM2=ISB`,
    notes: "AbsysNet oficial de Madrid. Búsqueda directa por ISBN-13.",
  },
  catalunya: {
    id: "catalunya",
    name: "Cataluña / Catalunya",
    networkName: "Catàleg Atena (Biblioteques Públiques de Catalunya)",
    opacUrlBuilder: (isbn: string) =>
      `https://atena.biblioteques.cat/search*cat/?searchtype=i&searcharg=${encodeURIComponent(
        isbn.replace(/[-\s]/g, "")
      )}`,
    notes: "Catàleg col·lectiu Atena de la Generalitat de Catalunya.",
  },
  andalucia: {
    id: "andalucia",
    name: "Andalucía",
    networkName: "Red de Bibliotecas Públicas de Andalucía",
    opacUrlBuilder: (isbn: string) =>
      `https://www.juntadeandalucia.es/cultura/absys/abnet_opac/abnetcl.exe?ACC=101&PARAM1=${encodeURIComponent(
        isbn.replace(/[-\s]/g, "")
      )}&PARAM2=ISB`,
    notes: "Red de Lectura Pública de Andalucía (Junta de Andalucía).",
  },
  valencia: {
    id: "valencia",
    name: "Comunitat Valenciana",
    networkName: "Xarxa de Lectura Pública Valenciana",
    opacUrlBuilder: (isbn: string) =>
      `https://xlpv.gva.es/absysnet/abnetcl.cgi?ACC=101&PARAM1=${encodeURIComponent(
        isbn.replace(/[-\s]/g, "")
      )}&PARAM2=ISB`,
    notes: "Catálogo XLPV de la Generalitat Valenciana.",
  },
  galicia: {
    id: "galicia",
    name: "Galicia",
    networkName: "Rede de Bibliotecas Públicas de Galicia",
    opacUrlBuilder: (isbn: string) =>
      `https://catalogo-rbgalicia.xunta.gal/cgi-bin/koha/opac-search.pl?q=${encodeURIComponent(
        isbn.replace(/[-\s]/g, "")
      )}`,
    notes: "Catálogo Koha da Rede de Bibliotecas de Galicia.",
  },
  euskadi: {
    id: "euskadi",
    name: "Euskadi / País Vasco",
    networkName: "Red de Lectura Pública de Euskadi (RLPE)",
    opacUrlBuilder: (isbn: string) =>
      `https://www.liburutegiak.euskadi.eus/katalogobateratua/abnetcl.cgi?ACC=101&PARAM1=${encodeURIComponent(
        isbn.replace(/[-\s]/g, "")
      )}&PARAM2=ISB`,
    notes: "Katalogo bateratua Euskadiko Irakurketa Publikoko Sarea.",
  },
  nacional_ccb: {
    id: "nacional_ccb",
    name: "Toda España (Catálogo Colectivo Nacional)",
    networkName: "Consejo de Cooperación Bibliotecaria (Ministerio de Cultura)",
    opacUrlBuilder: (isbn: string) =>
      `https://catalogos.mecd.es/CCB/cgi-bin/abnetcl?ACC=101&PARAM1=${encodeURIComponent(
        isbn.replace(/[-\s]/g, "")
      )}&PARAM2=ISB`,
    notes: "Catálogo Nacional unificado CCB del Estado español.",
  },
};

export const DEFAULT_REGION_KEY = "nacional_ccb";

/**
 * Obtiene la URL exacta de consulta de catálogo para una comunidad y un ISBN.
 */
export function getLibraryCatalogUrl(
  regionKey: string,
  isbn: string,
  title?: string
): string {
  const network = SPANISH_LIBRARY_NETWORKS[regionKey] || SPANISH_LIBRARY_NETWORKS[DEFAULT_REGION_KEY];
  return network.opacUrlBuilder(isbn, title);
}

/**
 * Retorna la lista completa de comunidades autónomas soportadas.
 */
export function getAllSupportedRegions() {
  return Object.values(SPANISH_LIBRARY_NETWORKS).map((net) => ({
    id: net.id,
    name: net.name,
    networkName: net.networkName,
  }));
}
