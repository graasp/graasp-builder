export enum PublicationStatus {
  Unpublished = 'unpublished',
  Published = 'published',
  PublishedChildren = 'publishedChildren',
  ReadyToPublish = 'readyToPublish',
  Pending = 'pending',
  Invalid = 'invalid',
  Outdated = 'outdated',
  NotPublic = 'notPublic',
}

export type PublicationStatusMap<T> = {
  [status in PublicationStatus]: T;
};
