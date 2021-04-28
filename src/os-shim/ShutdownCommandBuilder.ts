export enum WindowsShutdownFlag {
  LOGOFF = '/l',
  SHUTDOWN = '/s',
  RESTART = '/r',
  POWEROFF = '/p',
  HIBERNATE = '/h',
  FORCE = '/f',
  TIMEOUT = '/t',
  COMMENT = '/c',
  REASON = '/d'
}

export interface FlagObject {
  flag: WindowsShutdownFlag
  value?: string | number | boolean
  asFirst?: boolean
}

/**
 * Generic command builder class for the Windows shutdown command.
 * @see https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/shutdown
 */
export default class ShutdownCommandBuilder {
  public readonly BASE_COMMAND = 'shutdown'
  private readonly flags: FlagObject[] = []

  /**
   * Sets a flag on the shutdown command, optionally with a value.
   *
   * Note: Setting the same flag twice will overwrite any previous value this flag may have had.
   *
   * @param flag - {@link WindowsShutdownFlag}
   * @param asFirst - Whether to insert the flag as the first flag
   * @param value - Arbitrary value
   */
  setFlag = (flag: FlagObject['flag'], asFirst?: boolean, value?: FlagObject['value']): void => {
    // Overwrite old flags with new ones
    const possibleDupeIndex = this.flags.findIndex(possibleDupe => possibleDupe.flag === flag)

    if (possibleDupeIndex > -1) {
      this.flags.splice(possibleDupeIndex, 1)
    }

    asFirst ? this.flags.unshift({ flag, value }) : this.flags.push({ flag, value })
  }

  /**
   * Recursively executes ShutdownCommandBuilder.setFlag on an array of flag objects.
   *
   * @param flags - Array\<{@link FlagObject}\>
   */
  setFlags = (flags: FlagObject[]): void => flags.forEach(({ flag, value, asFirst }) => this.setFlag(flag, asFirst, value))

  /**
   * Unsets a flag on the shutdown command.
   *
   * @param flagToRemove - {@link WindowsShutdownFlag}
   */
  unsetFlag = (flagToRemove: WindowsShutdownFlag): void => {
    this.flags.splice(this.flags.findIndex(({ flag }) => flag === flagToRemove), 1)
  }

  /**
   * Recursively executes ShutdownCommandBuilder.unsetFlag on an array of flags.
   *
   * @param flagsToRemove - Array\<{@link WindowsShutdownFlag}\>
   */
  unsetFlags = (flagsToRemove: WindowsShutdownFlag[]): void => flagsToRemove.forEach(flag => this.unsetFlag(flag))

  /**
   * Returns all command arguments as an array of strings, without spaces and without combining them.
   *
   * @returns All command arguments
   */
  getArgs = (): string[] => {
    const args = []

    for (const { flag, value } of this.flags) {
      args.push(flag.toString())
      // Using explicit undefined check here so that empty strings and zeroes can pass through
      if (value !== undefined) args.push(JSON.stringify(value))
    }

    return args
  }

  /**
   * Returns the built command as one whole string, with arguments combined.
   *
   * @returns The built command
   */
  getCommandAsString = (): string => `${this.BASE_COMMAND} ${this.getArgs().join(' ')}`
}
