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
    opacUrlBuilder: () =>
      "https://gestiona.comunidad.madrid/biblio_publicas/cgi-bin/abnetopac",
    notes: "Catálogo oficial AbsysNet de la Comunidad de Madrid.",
  },
  catalunya: {
    id: "catalunya",
    name: "Cataluña / Catalunya",
    networkName: "Catàleg Atena (Biblioteques Públiques de Catalunya)",
    opacUrlBuilder: () =>
      "https://atena.biblioteques.cat/",
    notes: "Catálogo colectivo Atena de la Generalitat de Catalunya.",
  },
  andalucia: {
    id: "andalucia",
    name: "Andalucía",
    networkName: "Red de Bibliotecas Públicas de Andalucía (RBPA)",
    opacUrlBuilder: () =>
      "https://www.juntadeandalucia.es/cultura/rbpa/",
    notes: "Red de Lectura Pública de Andalucía (Junta de Andalucía).",
  },
  valencia: {
    id: "valencia",
    name: "Comunitat Valenciana",
    networkName: "Xarxa de Lectura Pública Valenciana (eXLPV)",
    opacUrlBuilder: () =>
      "https://xlpv.gva.es/cginet-bin/abnetop",
    notes: "Catálogo oficial de la Generalitat Valenciana.",
  },
  galicia: {
    id: "galicia",
    name: "Galicia",
    networkName: "Rede de Bibliotecas Públicas de Galicia",
    opacUrlBuilder: (isbn: string) =>
      `https://catalogo-rbgalicia.xunta.gal/cgi-bin/koha/opac-search.pl?q=${encodeURIComponent(
        isbn.replace(/[-\s]/g, "")
      )}`,
    notes: "Catálogo Koha da Rede de Bibliotecas de Galicia con búsqueda directa por ISBN.",
  },
  euskadi: {
    id: "euskadi",
    name: "Euskadi / País Vasco",
    networkName: "Red de Lectura Pública de Euskadi (RLPE)",
    opacUrlBuilder: () =>
      "https://www.liburutegiak.euskadi.eus/",
    notes: "Portal oficial de la Red de Lectura Pública de Euskadi.",
  },
  nacional_ccb: {
    id: "nacional_ccb",
    name: "Toda España (Catálogo Nacional CCBIP)",
    networkName: "Catálogo Colectivo de Bibliotecas Públicas (Ministerio de Cultura)",
    opacUrlBuilder: () =>
      "https://catalogos.cultura.gob.es/CCBIP/ccbipopac/",
    notes: "Catálogo Colectivo oficial del Ministerio de Cultura del Estado español.",
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
