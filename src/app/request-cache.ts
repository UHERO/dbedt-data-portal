import { HttpRequest, HttpResponse } from '@angular/common/http';

const maxAge = 300000; // 5 minutes
export class RequestCache {
  cache = new Map();

  get(request: HttpRequest<any>): HttpResponse<any> | undefined {
    const url = request.urlWithParams;
    const cached = this.cache.get(url);
    if (!cached) {
      return undefined;
    }
    const isExpired = (Date.now() - cached.lastRead) > maxAge;
    return isExpired ? undefined : cached.response;
  }

  put(request: HttpRequest<any>, response: HttpResponse<any>): void {
    const url = request.url;
    const cacheEntry = { url, response, lastRead: Date.now() };
    this.cache.set(url, cacheEntry);
    this.cache.forEach(expiredEntry => {
      if ((Date.now() - expiredEntry.lastRead) > maxAge) {
        this.cache.delete(expiredEntry.url);
      }
    });
  }
}
