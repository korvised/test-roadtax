import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm"
import { FeeEntity as Fee } from "./Fee.entity"

@Entity({ name: "provinces" })
export class ProvinceEntity {
  @PrimaryColumn({ nullable: false })
  code: string

  @Column({ nullable: false })
  name: string

  @OneToMany(() => Fee, (fee) => fee.province)
  fees: Fee[]

  @CreateDateColumn({ select: false })
  createdAt: Date

  @UpdateDateColumn({ select: false })
  updatedAt: Date
}
