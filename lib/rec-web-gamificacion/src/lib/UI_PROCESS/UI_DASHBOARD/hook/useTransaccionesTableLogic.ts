import { TransaccionDetalleDTO } from "../dtos/dtos";

export class TransaccionesTableLogic {
  private itemsPerPage = 5;

  filtrarTransacciones(
    transacciones: TransaccionDetalleDTO[],
    searchTerm: string,
    tipoFilter: string
  ): TransaccionDetalleDTO[] {
    return transacciones.filter((tx) => {
      const matchSearch =
        tx.nombreUsuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.descripcion.toLowerCase().includes(searchTerm.toLowerCase());

      const matchTipo = tipoFilter === 'todos' || tx.tipoPunto === tipoFilter;

      return matchSearch && matchTipo;
    });
  }

  paginarTransacciones(
    transacciones: TransaccionDetalleDTO[],
    page: number
  ): TransaccionDetalleDTO[] {
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return transacciones.slice(startIndex, endIndex);
  }

  getTotalPages(transacciones: TransaccionDetalleDTO[]): number {
    return Math.ceil(transacciones.length / this.itemsPerPage);
  }
}
