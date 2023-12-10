type DiskPartition = {
  partitionType: string;
  name: string;
  size: string;
  identifier: string;
};

type Disk = {
  device: string;
  type: string;
  partitions: DiskPartition[];
};

export type { Disk, DiskPartition };