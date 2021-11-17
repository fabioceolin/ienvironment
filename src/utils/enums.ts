export enum Role {
  Administrator = 0,
  User = 1,
}

export enum EntityType {
  String = 0,
  Int = 1,
  Boolean = 2,
  Numeric = 3,
}

export enum EventType {
  Manual = 0,
  Temporal = 1,
  Conditional = 2,
}

export enum DayOfWeek {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
}

export enum ComparatorType {
  Equals = 0,
  GreaterThan = 1,
  LessThan = 2,
  DifferentFrom = 3,
  EqualOrLessThan = 4,
  EqualOrGreaterThan = 5,
}

export enum NextConditionType {
  And = 0,
  Or = 1,
}
