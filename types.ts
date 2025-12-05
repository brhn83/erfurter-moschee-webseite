/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export interface Activity {
  id: string;
  title: string;
  time: string;
  image: string;
  description: string;
  category: string;
}

export interface PrayerTime {
  name: string;
  time: string;
  iqamah: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}
